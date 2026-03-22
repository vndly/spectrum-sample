The implementation plan. Can be updated to mark what has been done. Focuses on how.

# Implementation Spec: [Feature Name]

## 1. The Strategy (The "Plan")

**Goal:** Allow users to upload avatars to S3 and update their profile record.

**Architectural Decisions:**

- **Storage:** Use AWS S3 with pre-signed URLs (Client-side upload) to save server bandwidth.
- **Validation:** Limit files to 2MB and `image/jpeg` or `image/png` only.
- **State:** Use `react-query` to invalidate the `user-profile` cache after a successful upload.

**File Impact Map:**

- `src/hooks/useUpload.ts`: Logic for fetching pre-signed URLs.
- `src/components/AvatarPicker.tsx`: UI for file selection and preview.
- `api/profile/upload-url.ts`: Serverless function to generate S3 signatures.

---

## 2. The Execution (The "Tasks")

### Phase 1: Infrastructure & Backend

- [x] Create S3 bucket `user-avatars-prod` with CORS allowed for our domain.
- [ ] Implement `GET /api/profile/upload-url` with Zod validation for file type.
- [ ] Write unit test for URL signature expiration logic.

### Phase 2: Frontend Logic

- [ ] Create `useUpload` hook to handle the 3-step process (Get URL -> Put to S3 -> Update DB).
- [ ] Add "Loading" and "Error" states to the upload progress bar.

### Phase 3: UI & Polish

- [ ] Integrate `AvatarPicker` into the Settings page.
- [ ] Add image compression/resizing on the client-side using `browser-image-compression`.
- [ ] Verify that the new avatar appears immediately without a page refresh.

---

## 3. Verification Checklist

- [ ] Does it work on mobile Safari?
- [ ] Does it reject a 5MB file with a helpful error message?
- [ ] Is the S3 bucket private (no public read)?
