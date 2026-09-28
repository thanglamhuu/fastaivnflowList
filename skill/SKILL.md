---
name: facebook-post-with-image
description: Create and publish a Facebook feed post from a user-provided caption and local image path through the in-app browser. Use when the user asks to post, prepare, or publish a Facebook post containing text and an image; do not use for bulk posting or Super Post King workflows.
---

# Facebook Post With Image

Use the Browser skill and the in-app browser tab containing Facebook. Treat the caption and local image path as per-run inputs; never reuse values from an earlier post.

## Required inputs

- Caption text.
- Absolute local path to one image.
- Whether the user wants a draft or a published post. If they ask to “đăng”, “publish”, or equivalent, treat that as intent to publish, subject to the browser's action-time confirmation requirements.

## Workflow

1. Verify the image exists before interacting with Facebook. If the supplied path does not exist and appears to contain Markdown-escaped underscores or a missing separator, search only the named parent directory or `Downloads` for a unique filename match. Use the unique match and report the corrected path. If several files match, ask the user to choose.
2. Claim the existing Facebook tab. On the home feed, click the “Bạn đang nghĩ gì thế?” composer control and wait for the **Tạo bài viết** dialog.
3. Follow the Browser confirmation policy. When confirmation is required for entering representational content or publishing, group the imminent actions into one precise request naming Facebook, the caption, the image, and the selected audience. Do not post before confirmation.
4. Fill the dialog's textbox with the exact caption. Do not rewrite, expand, or add hashtags unless requested.
5. Add the image through the documented file-chooser flow. Wait until the dialog shows the uploaded filename or media preview.
6. Verify all three items in the live dialog: exact caption, expected image filename, and intended audience. Default to the audience already selected by Facebook; do not change it silently. If it is **Công khai**, explicitly include that in the confirmation or result.
7. For a draft request, stop here and leave the composer open. For a publish request with valid confirmation, click the dialog's exact **Đăng** button once.
8. Wait for the composer to close and verify the new post appears on the feed with the requested caption, an image, and the intended audience. Report success only after this evidence is visible.

## Safety and stopping conditions

- Never click **Đăng** twice. If the result is uncertain, inspect the feed before retrying.
- Do not add locations, tags, collaborators, stories, groups, boosts, or AI labels unless the user asks.
- Do not replace a missing image with another file without a unique filename match or user choice.
- If Facebook shows a CAPTCHA, account warning, permission request, or publishing error, stop and follow the Browser confirmation or handoff requirements.
