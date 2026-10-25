# SGX auto-publish staging checklist

- [ ] `sgx.autoPublish=false` (default): new sync → pending_review + review digest
- [ ] Set `sgx.autoPublish=true` and `fe.deployHookURL=<staging hook>`
- [ ] Run `php spark sgx:sync` with a known-new SGX item (or fixture in staging)
- [ ] Row: state=published, live_at set; CF Pages rebuild started
- [ ] Admin mail: subject contains `auto-published`
- [ ] Unset/wrong hook URL: row stays/returns pending_review; subject contains `auto-publish failed`
- [ ] Existing pending_review rows unchanged when flag flipped on
- [ ] `sgx.backfill=true` still ignores auto-publish path
