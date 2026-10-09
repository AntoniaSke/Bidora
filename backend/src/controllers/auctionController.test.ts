import assert from "node:assert/strict";
import { test } from "node:test";
import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { getAuctions, createAuction, updateAuction, deleteAuction } from "./auctionController.js";
import { auctionCategorySchema, createAuctionSchema, updateAuctionSchema } from "../schemas/auctionSchema.js";

// Replace the lazy Prisma delegate with an inert object before mocking methods.
// No test can fall through to a real database operation.
type EligibleWhere = { id: number; sellerId: number; bids: number; endsAt: { gt: Date; lt?: Date }; description?: { startsWith: string }; seller?: { email: string }; bidHistory?: { every: { user: { email: { in: string[] } } } } };
const auctionStore = {
  async findMany(_args: { where: { category?: string; endsAt: { gt: Date } }; orderBy: unknown }) { return []; },
  async create(_args: { data: Record<string, unknown> }) { return auction(); },
  async findUnique(_args: { where: { id: number } }): Promise<ReturnType<typeof auction> | null> { return null; },
  async updateMany(_args: { where: EligibleWhere; data: Record<string, unknown> }) { return { count: 0 }; },
  async deleteMany(_args: { where: EligibleWhere }) { return { count: 0 }; },
};
Object.defineProperty(prisma, "auction", { value: auctionStore, configurable: true });
function request(body: unknown = {}, id = "1", userId = 7) {
  return { body, query: {}, params: { id }, user: { userId } } as unknown as Request;
}

function response() {
  const result = { code: 200, body: undefined as unknown };
  const res = {
    status(code: number) { result.code = code; return res; },
    json(body: unknown) { result.body = body; return res; },
  } as unknown as Response;
  return { res, result };
}

function auction() {
  return {
    id: 1, sellerId: 7, bids: 0, startingPrice: 50, currentBid: 50,
    title: "Test auction", description: "Normal auction description", endsAt: new Date(Date.now() + 86_400_000),
  };
}

function validPayload() {
  return {
    title: "Test auction", description: "A detailed test description.",
    category: "Gaming", startingPrice: 50,
    image: "https://example.com/auction.jpg",
    endsAt: new Date(Date.now() + 86_400_000).toISOString(),
  };
}

test("creation rejects invalid input before any database write", async (t) => {
  const create = t.mock.method(auctionStore, "create", async () => {
    throw new Error("Invalid input must never reach Prisma");
  });
  for (const patch of [
    { title: "ab" }, { title: " ".repeat(10) },
    { description: "short" }, { description: "x".repeat(1001) },
    { category: "Unknown" }, { startingPrice: -1 }, { startingPrice: "50" },
    { startingPrice: Infinity }, { startingPrice: NaN },
    { image: "javascript:alert(1)" }, { image: "/image.jpg" },
    { endsAt: "not-a-date" }, { endsAt: "2000-01-01T00:00:00Z" },
    { endsAt: "2030-01-01T12:00" }, { sellerId: 99 },
  ]) {
    const { res, result } = response();
    await createAuction(request({ ...validPayload(), ...patch }), res);
    assert.equal(result.code, 400, JSON.stringify(patch));
  }
  assert.equal(create.mock.callCount(), 0);
});

test("creation persists validated data and the authenticated seller", async (t) => {
  const create = t.mock.method(auctionStore, "create", async () => auction());
  const { res, result } = response();
  await createAuction(request({ ...validPayload(), title: "  Test auction  " }), res);
  assert.equal(result.code, 201);
  const data = create.mock.calls[0].arguments[0]!.data;
  assert.equal(data.title, "Test auction");
  assert.equal(data.currentBid, 50);
  assert.deepEqual(data.seller, { connect: { id: 7 } });
  assert.ok(data.endsAt instanceof Date);
});

test("update accepts partial fields but rejects empty or unsafe patches", () => {
  assert.equal(updateAuctionSchema.safeParse({ title: "New title" }).success, true);
  assert.equal(updateAuctionSchema.safeParse({}).success, false);
  assert.equal(updateAuctionSchema.safeParse({ currentBid: 1 }).success, false);
  assert.equal(updateAuctionSchema.safeParse({ startingPrice: 0 }).success, false);
  assert.equal(createAuctionSchema.safeParse({
    ...validPayload(), endsAt: "2030-01-01T15:00:00+03:00",
  }).success, true);
});

test("editing after a bid never resets currentBid or changes any fields", async (t) => {
  t.mock.method(auctionStore, "findUnique", async () => ({ ...auction(), bids: 1, currentBid: 80 }));
  const write = t.mock.method(auctionStore, "updateMany", async () => ({ count: 1 }));
  const { res, result } = response();
  await updateAuction(request({ title: "New title" }), res);
  assert.equal(result.code, 400);
  assert.equal(write.mock.callCount(), 0);
});

test("title-only editing preserves the price and checks eligibility in the write", async (t) => {
  t.mock.method(auctionStore, "findUnique", async () => auction());
  const write = t.mock.method(auctionStore, "updateMany", async () => ({ count: 1 }));
  const { res, result } = response();
  await updateAuction(request({ title: "New title" }), res);
  assert.equal(result.code, 200);
  const { where, data } = write.mock.calls[0].arguments[0]!;
  assert.equal(where.id, 1);
  assert.equal(where.sellerId, 7);
  assert.equal(where.bids, 0);
  assert.ok(where.endsAt && typeof where.endsAt === "object" && "gt" in where.endsAt);
  assert.deepEqual(data, { title: "New title" });
});

test("starting price changes before bidding keep the initial currentBid in sync", async (t) => {
  t.mock.method(auctionStore, "findUnique", async () => auction());
  const write = t.mock.method(auctionStore, "updateMany", async () => ({ count: 1 }));
  const { res, result } = response();
  await updateAuction(request({ startingPrice: 65 }), res);
  assert.equal(result.code, 200);
  assert.deepEqual(write.mock.calls[0].arguments[0]!.data, { startingPrice: 65, currentBid: 65 });
});

test("a failed conditional edit/delete returns a conflict instead of success", async (t) => {
  t.mock.method(auctionStore, "findUnique", async () => auction());
  t.mock.method(auctionStore, "updateMany", async () => ({ count: 0 }));
  const remove = t.mock.method(auctionStore, "deleteMany", async () => ({ count: 0 }));
  for (const handler of [updateAuction, deleteAuction]) {
    const { res, result } = response();
    await handler(request({ title: "New title" }), res);
    assert.equal(result.code, 409);
  }
  const where = remove.mock.calls[0].arguments[0]!.where!;
  assert.equal(where.sellerId, 7);
  assert.equal(where.bids, 0);
  assert.ok(where.endsAt && typeof where.endsAt === "object" && "gt" in where.endsAt);
});

test("edit/delete reject invalid IDs before reading the database", async (t) => {
  const read = t.mock.method(auctionStore, "findUnique", async () => auction());
  for (const id of ["NaN", "0", "-1", "1.5", "9007199254740992"]) {
    for (const handler of [updateAuction, deleteAuction]) {
      const { res, result } = response();
      await handler(request({ title: "New title" }, id), res);
      assert.equal(result.code, 400);
    }
  }
  assert.equal(read.mock.callCount(), 0);
});

test("edit/delete reject missing, other-owned, ended and bid-on auctions", async (t) => {
  let existing: ReturnType<typeof auction> | null = null;
  t.mock.method(auctionStore, "findUnique", async () => existing);
  const write = t.mock.method(auctionStore, "updateMany", async () => ({ count: 1 }));
  const remove = t.mock.method(auctionStore, "deleteMany", async () => ({ count: 1 }));
  for (const [value, code] of [
    [null, 404], [{ ...auction(), sellerId: 8 }, 403],
    [{ ...auction(), endsAt: new Date(0) }, 400], [{ ...auction(), bids: 1 }, 400],
  ] as const) {
    existing = value;
    for (const handler of [updateAuction, deleteAuction]) {
      const { res, result } = response();
      await handler(request({ title: "New title" }), res);
      assert.equal(result.code, code);
    }
  }
  assert.equal(write.mock.callCount(), 0);
  assert.equal(remove.mock.callCount(), 0);
});


test("category filtering normalizes all supported categories and retains active-only filtering", async (t) => {
  const read = t.mock.method(auctionStore, "findMany", async () => []);
  for (const category of auctionCategorySchema.options) {
    const { res, result } = response();
    await getAuctions({ query: { category: ` ${category.toLowerCase()} ` } } as unknown as Request, res);
    assert.equal(result.code, 200);
    const where = read.mock.calls.at(-1)!.arguments[0]!.where;
    assert.equal(where.category, category);
    assert.ok(where.endsAt.gt instanceof Date);
    assert.equal(createAuctionSchema.safeParse({ ...validPayload(), category }).success, true);
  }
});

test("unfiltered listing works and invalid categories never reach the database", async (t) => {
  const read = t.mock.method(auctionStore, "findMany", async () => []);
  const { res, result } = response();
  await getAuctions(request(), res);
  assert.equal(result.code, 200);
  assert.equal(read.mock.calls[0].arguments[0]!.where.category, undefined);
  for (const category of ["Unknown", "", ["Gaming", "Art"], { name: "Art" }]) {
    const { res, result } = response();
    await getAuctions({ query: { category } } as unknown as Request, res);
    assert.equal(result.code, 400);
  }
  assert.equal(read.mock.callCount(), 1);
});


test("demo catalogue covers every category with five valid unique listings", async () => {
  const { buildDemoAuctions } = await import("../scripts/seedAuctions.js");
  const auctions = buildDemoAuctions("validation");
  assert.equal(auctions.length, 100);
  assert.equal(new Set(auctions.map((auction) => auction.title)).size, 100);
  for (const category of auctionCategorySchema.options) {
    assert.equal(auctions.filter((auction) => auction.category === category).length, 5);
  }
  assert.ok(auctions.every((auction) => auction.description.startsWith("[DEMO:validation]")));
});

test("demo activity uses increasing bids and different consecutive bidders", async () => {
  const { activityPlan } = await import("../scripts/seedDemoActivity.js");
  let total = 0;
  for (let index = 0; index < 100; index++) {
    const plan = activityPlan(index, 25);
    total += plan.length;
    let previousAmount = 25;
    let previousBidder = -1;
    for (const bid of plan) {
      assert.ok(bid.amount > previousAmount);
      assert.notEqual(bid.bidderIndex, previousBidder);
      assert.ok(bid.bidderIndex >= 0 && bid.bidderIndex < 4);
      previousAmount = bid.amount;
      previousBidder = bid.bidderIndex;
    }
  }
  assert.equal(total, 250);
});


test("demo deadline refresh changes only endsAt and restricts the atomic write to demo bids", async (t) => {
  const existing = { ...auction(), description: "[DEMO:catalogue_v3] Sample", bids: 2, currentBid: 80 };
  t.mock.method(auctionStore, "findUnique", async () => existing);
  const write = t.mock.method(auctionStore, "updateMany", async () => ({ count: 1 }));
  const endsAt = new Date(Date.now() + 60 * 86_400_000).toISOString();
  const req = request({ endsAt });
  req.user!.email = "bidora_demo_catalogue_v3@bidora.demo";
  const { res, result } = response();
  await updateAuction(req, res);
  assert.equal(result.code, 200);
  const { where, data } = write.mock.calls[0].arguments[0]!;
  assert.deepEqual(data, { endsAt: new Date(endsAt) });
  assert.equal(where.bids, 2);
  assert.equal(where.seller?.email, req.user!.email);
  assert.equal(where.bidHistory?.every.user.email.in.length, 4);
  assert.equal(where.description?.startsWith, "[DEMO:catalogue_v3]");
});

test("demo refresh refuses ordinary actors, other fields, shorter dates and failed eligibility", async (t) => {
  const existing = { ...auction(), description: "[DEMO:catalogue_v3] Sample", bids: 2 };
  t.mock.method(auctionStore, "findUnique", async () => existing);
  const write = t.mock.method(auctionStore, "updateMany", async () => ({ count: 0 }));
  const longer = new Date(Date.now() + 60 * 86_400_000).toISOString();
  for (const [body, email, code] of [
    [{ endsAt: longer }, "ordinary@example.com", 400],
    [{ endsAt: longer, title: "Changed title" }, "bidora_demo_catalogue_v3@bidora.demo", 400],
    [{ endsAt: new Date(Date.now() + 3600_000).toISOString() }, "bidora_demo_catalogue_v3@bidora.demo", 400],
    [{ endsAt: new Date(Date.now() + 200 * 86_400_000).toISOString() }, "bidora_demo_catalogue_v3@bidora.demo", 400],
    [{ endsAt: longer }, "bidora_demo_catalogue_v3@bidora.demo", 409],
  ] as const) {
    const req = request(body); req.user!.email = email;
    const { res, result } = response(); await updateAuction(req, res); assert.equal(result.code, code);
  }
  assert.equal(write.mock.callCount(), 1);
});

test("demo deadlines reserve three ending-soon listings and keep all others 30–90 days away", async () => {
  const { buildDemoAuctions } = await import("../scripts/seedAuctions.js");
  const now = Date.now(); const auctions = buildDemoAuctions("validation", now);
  const days = auctions.map((auction) => (new Date(auction.endsAt).getTime() - now) / 86_400_000);
  assert.equal(days.filter((value) => value < 1).length, 3);
  assert.ok(days.slice(3).every((value) => value >= 30 && value <= 90));
  assert.ok(auctions.every((auction) => auction.image.startsWith("https://")));
});
