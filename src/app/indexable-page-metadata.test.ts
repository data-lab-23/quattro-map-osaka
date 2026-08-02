import assert from "node:assert/strict";
import test from "node:test";
import { metadata as privacyMetadata } from "./privacy/page";
import { metadata as submitMetadata } from "./submit/page";

test("privacy and submit pages publish self-referential canonical paths", () => {
  assert.deepEqual(privacyMetadata.alternates, { canonical: "/privacy" });
  assert.deepEqual(submitMetadata.alternates, { canonical: "/submit" });
});

test("privacy and submit pages include shared social metadata", () => {
  for (const metadata of [privacyMetadata, submitMetadata]) {
    const openGraph = metadata.openGraph;
    const twitter = metadata.twitter;

    assert.ok(openGraph && "type" in openGraph);
    assert.ok(twitter && "card" in twitter);
    assert.equal(openGraph.type, "website");
    assert.equal(twitter.card, "summary_large_image");
  }
});
