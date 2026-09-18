<?php
declare(strict_types=1);

namespace App\Controllers\Admin;

use App\Controllers\BaseController;
use App\Models\EmailCampaignModel;
use CodeIgniter\HTTP\RedirectResponse;

class Campaigns extends BaseController
{
    public function retryFailed(int $id): RedirectResponse
    {
        $campaign = model(EmailCampaignModel::class)->find($id);
        $redirectTo = $campaign !== null
            ? '/admin/announcements/' . $campaign['announcement_id']
            : '/admin';

        $db = db_connect();
        if (! $db->tableExists('email_deliveries')) {
            return redirect()->to($redirectTo)->with('error', 'Email worker not deployed');
        }

        $db->table('email_deliveries')
            ->where('campaign_id', $id)
            ->where('status', 'failed_temp')
            ->update(['status' => 'queued']);

        service('auditLogger')->write('retry', 'campaign', (string) $id, []);

        return redirect()->to($redirectTo)->with('message', 'Retries queued');
    }
}
