<?php
/**
 * Shared announcement create/edit field sections.
 *
 * @var array<string, mixed> $values
 * @var list<array{name?: string, url?: string}> $attachments
 */
$values = $values ?? [];
$attachments = $attachments ?? [];
$v = static function (string $key) use ($values): string {
    return esc((string) ($values[$key] ?? ''));
};
$extraSlots = max(0, 3 - count($attachments));
?>

<section class="form-section card" aria-labelledby="sec-core">
    <div class="form-section-head">
        <h2 id="sec-core">Listing</h2>
        <p class="form-hint">Required fields shown on the announcements list and website.</p>
    </div>
    <div class="form-group">
        <label class="label" for="title">Title <span class="req" aria-hidden="true">*</span></label>
        <input class="input" id="title" type="text" name="title" value="<?= $v('title') ?>" required autocomplete="off">
    </div>
    <div class="form-grid form-grid-2">
        <div class="form-group">
            <label class="label" for="category">Category <span class="req" aria-hidden="true">*</span></label>
            <input class="input" id="category" type="text" name="category" value="<?= $v('category') ?>" required>
        </div>
        <div class="form-group">
            <label class="label" for="filed_at">Filed at (SGT) <span class="req" aria-hidden="true">*</span></label>
            <input class="input" id="filed_at" type="text" name="filed_at" placeholder="YYYY-MM-DD HH:MM:SS" value="<?= $v('filed_at') ?>" required>
        </div>
    </div>
    <div class="form-group">
        <label class="label" for="source_url">Source URL</label>
        <input class="input" id="source_url" type="url" name="source_url" value="<?= $v('source_url') ?>" placeholder="https://…">
    </div>
    <div class="form-group">
        <label class="label" for="summary">Summary</label>
        <textarea class="input" id="summary" name="summary" rows="3" placeholder="Short blurb for the website list"><?= $v('summary') ?></textarea>
    </div>
    <div class="form-group">
        <label class="label" for="body_html">Body HTML</label>
        <textarea class="input" id="body_html" name="body_html" rows="5" placeholder="Optional rich body"><?= $v('body_html') ?></textarea>
    </div>
</section>

<section class="form-section card" aria-labelledby="sec-issuer">
    <div class="form-section-head">
        <h2 id="sec-issuer">Issuer &amp; securities</h2>
        <p class="form-hint">Shown in the announcement detail header on the public site.</p>
    </div>
    <div class="form-group">
        <label class="label" for="issuer_name">Issuer name</label>
        <input class="input" id="issuer_name" type="text" name="issuer_name" value="<?= $v('issuer_name') ?>">
    </div>
    <div class="form-grid form-grid-2">
        <div class="form-group">
            <label class="label" for="securities_name">Securities</label>
            <input class="input" id="securities_name" type="text" name="securities_name" value="<?= $v('securities_name') ?>">
        </div>
        <div class="form-group">
            <label class="label" for="stapled_security_name">Stapled security</label>
            <input class="input" id="stapled_security_name" type="text" name="stapled_security_name" value="<?= $v('stapled_security_name') ?>">
        </div>
    </div>
</section>

<section class="form-section card" aria-labelledby="sec-detail">
    <div class="form-section-head">
        <h2 id="sec-detail">Announcement detail</h2>
        <p class="form-hint">SGX-style detail fields. Leave blank if not applicable.</p>
    </div>
    <div class="form-group">
        <label class="label" for="ann_title">Announcement title</label>
        <input class="input" id="ann_title" type="text" name="ann_title" value="<?= $v('ann_title') ?>">
    </div>
    <div class="form-group">
        <label class="label" for="ann_subtitle">Subtitle</label>
        <input class="input" id="ann_subtitle" type="text" name="ann_subtitle" value="<?= $v('ann_subtitle') ?>">
    </div>
    <div class="form-grid form-grid-2">
        <div class="form-group">
            <label class="label" for="ann_datetime">Date / time (display)</label>
            <input class="input" id="ann_datetime" type="text" name="ann_datetime" value="<?= $v('ann_datetime') ?>">
        </div>
        <div class="form-group">
            <label class="label" for="ann_status">Status</label>
            <input class="input" id="ann_status" type="text" name="ann_status" value="<?= $v('ann_status') ?>">
        </div>
        <div class="form-group">
            <label class="label" for="ann_reference">SGX reference</label>
            <input class="input" id="ann_reference" type="text" name="ann_reference" value="<?= $v('ann_reference') ?>">
        </div>
        <div class="form-group">
            <label class="label" for="ann_submitted_by">Submitted by</label>
            <input class="input" id="ann_submitted_by" type="text" name="ann_submitted_by" value="<?= $v('ann_submitted_by') ?>">
        </div>
        <div class="form-group">
            <label class="label" for="ann_designation">Designation</label>
            <input class="input" id="ann_designation" type="text" name="ann_designation" value="<?= $v('ann_designation') ?>">
        </div>
        <div class="form-group">
            <label class="label" for="ann_effective_start_date">Effective start date</label>
            <input class="input" id="ann_effective_start_date" type="text" name="ann_effective_start_date" value="<?= $v('ann_effective_start_date') ?>">
        </div>
        <div class="form-group">
            <label class="label" for="ann_report_type">Report type</label>
            <input class="input" id="ann_report_type" type="text" name="ann_report_type" value="<?= $v('ann_report_type') ?>">
        </div>
        <div class="form-group">
            <label class="label" for="ann_final_year_end">Final year end</label>
            <input class="input" id="ann_final_year_end" type="text" name="ann_final_year_end" value="<?= $v('ann_final_year_end') ?>">
        </div>
    </div>
    <div class="form-group">
        <label class="label" for="ann_description">Description</label>
        <textarea class="input" id="ann_description" name="ann_description" rows="6"><?= $v('ann_description') ?></textarea>
    </div>
    <div class="form-group">
        <label class="label" for="ann_disclaimer">Disclaimer</label>
        <textarea class="input" id="ann_disclaimer" name="ann_disclaimer" rows="3"><?= $v('ann_disclaimer') ?></textarea>
    </div>
</section>

<section class="form-section card" aria-labelledby="sec-attach">
    <div class="form-section-head">
        <h2 id="sec-attach">Attachments</h2>
        <p class="form-hint">File name + URL per row. Empty rows are skipped. Saving replaces the full list.</p>
    </div>
    <div class="attachment-list">
        <div class="attachment-row attachment-row-head" aria-hidden="true">
            <span>File name</span>
            <span>URL</span>
        </div>
        <?php foreach ($attachments as $att): ?>
            <div class="attachment-row">
                <input class="input" type="text" name="attachment_name[]" placeholder="e.g. Annual Report.pdf" aria-label="Attachment file name" value="<?= esc((string) ($att['name'] ?? '')) ?>">
                <input class="input" type="url" name="attachment_url[]" placeholder="https://…" aria-label="Attachment URL" value="<?= esc((string) ($att['url'] ?? '')) ?>">
            </div>
        <?php endforeach; ?>
        <?php for ($i = 0; $i < $extraSlots; $i++): ?>
            <div class="attachment-row">
                <input class="input" type="text" name="attachment_name[]" placeholder="e.g. Annual Report.pdf" aria-label="Attachment file name" value="">
                <input class="input" type="url" name="attachment_url[]" placeholder="https://…" aria-label="Attachment URL" value="">
            </div>
        <?php endfor; ?>
    </div>
</section>

<details class="form-section card form-disclosure">
    <summary>
        <span class="form-disclosure-title">Website layout overrides</span>
        <span class="form-hint">Optional. Leave blank to auto-derive from title / category.</span>
    </summary>
    <div class="form-disclosure-body">
        <div class="form-group">
            <label class="label" for="title_btn">List title (desktop)</label>
            <input class="input" id="title_btn" type="text" name="title_btn" value="<?= $v('title_btn') ?>">
        </div>
        <div class="form-group">
            <label class="label" for="title_btn_sm">List title (mobile)</label>
            <input class="input" id="title_btn_sm" type="text" name="title_btn_sm" value="<?= $v('title_btn_sm') ?>">
        </div>
        <div class="form-group">
            <label class="label" for="title_banner">Banner title</label>
            <input class="input" id="title_banner" type="text" name="title_banner" value="<?= $v('title_banner') ?>">
        </div>
    </div>
</details>

<details class="form-section card form-disclosure">
    <summary>
        <span class="form-disclosure-title">Personnel / cessation fields</span>
        <span class="form-hint">Only used for appointment or cessation announcements.</span>
    </summary>
    <div class="form-disclosure-body">
        <div class="form-group">
            <label class="label" for="addl_description">Additional description</label>
            <textarea class="input" id="addl_description" name="addl_description" rows="3"><?= $v('addl_description') ?></textarea>
        </div>
        <div class="form-grid form-grid-2">
            <div class="form-group">
                <label class="label" for="addl_name">Name of person</label>
                <input class="input" id="addl_name" type="text" name="addl_name" value="<?= $v('addl_name') ?>">
            </div>
            <div class="form-group">
                <label class="label" for="addl_age">Age</label>
                <input class="input" id="addl_age" type="text" name="addl_age" value="<?= $v('addl_age') ?>">
            </div>
            <div class="form-group">
                <label class="label" for="addl_date_of_appointment">Date of appointment</label>
                <input class="input" id="addl_date_of_appointment" type="text" name="addl_date_of_appointment" value="<?= $v('addl_date_of_appointment') ?>">
            </div>
            <div class="form-group">
                <label class="label" for="addl_date_cessation">Date of cessation</label>
                <input class="input" id="addl_date_cessation" type="text" name="addl_date_cessation" value="<?= $v('addl_date_cessation') ?>">
            </div>
            <div class="form-group">
                <label class="label" for="addl_date_cessation_known">Cessation date known?</label>
                <input class="input" id="addl_date_cessation_known" type="text" name="addl_date_cessation_known" value="<?= $v('addl_date_cessation_known') ?>">
            </div>
            <div class="form-group">
                <label class="label" for="addl_country_of_principal_residence">Country of principal residence</label>
                <input class="input" id="addl_country_of_principal_residence" type="text" name="addl_country_of_principal_residence" value="<?= $v('addl_country_of_principal_residence') ?>">
            </div>
        </div>
    </div>
</details>
