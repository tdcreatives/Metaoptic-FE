<?php
declare(strict_types=1);

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use App\Libraries\Http\CorsHeaders;
use CodeIgniter\HTTP\ResponseInterface;
use Config\Services;

class Contact extends BaseController
{
    public function create(): ResponseInterface
    {
        CorsHeaders::apply($this->request, $this->response);

        $input = $this->request->getJSON(true);
        if (! is_array($input)) {
            $input = $this->request->getPost();
        }
        if (! is_array($input)) {
            $input = [];
        }

        $token = (string) ($input['turnstileToken'] ?? '');
        if (! Services::turnstileVerifier()->verify($token, (string) $this->request->getIPAddress())) {
            return $this->fail(400, 'Please complete the captcha and try again.');
        }

        $channel = (string) ($input['channel'] ?? '');
        if (! in_array($channel, ['main', 'ir'], true)) {
            return $this->fail(400, 'Invalid channel.');
        }

        $fullName = trim((string) ($input['fullName'] ?? ''));
        $email = trim((string) ($input['email'] ?? ''));
        $message = trim((string) ($input['message'] ?? ''));
        if ($fullName === '' || $message === '' || ! preg_match('/^[^\s@]+@[^\s@]+\.[^\s@]+$/', $email)) {
            return $this->fail(400, 'Invalid request.');
        }

        $payload = $this->web3Payload($channel, $input);
        if ($payload['access_key'] === '') {
            return $this->fail(502, 'Submit failed');
        }

        $result = Services::web3FormsClient()->submit($payload);
        if (($result['ok'] ?? false) === true) {
            return $this->response->setStatusCode(200)->setJSON(['ok' => true]);
        }

        return $this->fail(502, (string) ($result['error'] ?? 'Submit failed'));
    }

    /** @param array<string, mixed> $input @return array<string, mixed> */
    private function web3Payload(string $channel, array $input): array
    {
        $email = trim((string) ($input['email'] ?? ''));
        $fullName = trim((string) ($input['fullName'] ?? ''));
        $phone = trim((string) ($input['phone'] ?? ''));
        $subject = trim((string) ($input['subject'] ?? ''));
        $message = trim((string) ($input['message'] ?? ''));

        if ($channel === 'ir') {
            return [
                'access_key' => (string) (env('web3forms.irAccessKey') ?: ''),
                'subject' => 'MetaOptics IR - Investor Contact',
                'from_name' => 'MetaOptics IR Contact',
                'email' => $email,
                'replyto' => $email,
                'name' => $fullName,
                'phone' => $phone !== '' ? $phone : '—',
                'investor_subject' => $subject !== '' ? $subject : 'Investor Inquiry',
                'message' => $message,
            ];
        }

        return [
            'access_key' => (string) (env('web3forms.mainAccessKey') ?: env('NEXT_PUBLIC_WEB3FORMS_ACCESS_TOKEN') ?: ''),
            'subject' => (string) (env('web3forms.mainSubject') ?: env('NEXT_PUBLIC_SUBJECT') ?: 'New Enquiry from Metaoptic'),
            'from_name' => 'MetaOptics Website Contact',
            'email' => $email,
            'phone' => $phone,
            'customer_subject' => $subject,
            'message' => $message,
            'replyto' => $email,
            'full_name' => $fullName,
        ];
    }

    private function fail(int $code, string $error): ResponseInterface
    {
        return $this->response->setStatusCode($code)->setJSON(['ok' => false, 'error' => $error]);
    }
}
