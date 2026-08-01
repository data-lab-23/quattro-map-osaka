import assert from "node:assert/strict";
import test from "node:test";
import { metadata as privacyMetadata } from "./privacy/page";
import { metadata as submitMetadata } from "./submit/page";

test("privacy and submit pages publish self-referential canonical paths", () => {
  assert.deepEqual(privacyMetadata.alternates, { canonical: "/privacy" });
  assert.deepEqual(submitMetadata.alternates, { canonical: "/submit" });
});
