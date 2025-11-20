'use client';

import { useQuery } from '@tanstack/react-query';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { kycApi } from '@/lib/api/kyc';
import { CheckCircle, Clock, XCircle, FileText } from 'lucide-react';
import Link from 'next/link';

export default function KYCSettingsPage() {
  const { data: kycStatus } = useQuery({
    queryKey: ['kycStatus'],
    queryFn: kycApi.getStatus,
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="w-6 h-6 text-success" />;
      case 'pending':
        return <Clock className="w-6 h-6 text-primary" />;
      case 'rejected':
        return <XCircle className="w-6 h-6 text-destructive" />;
      default:
        return <FileText className="w-6 h-6 text-muted-foreground" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'verified':
        return 'Verified';
      case 'pending':
        return 'Under Review';
      case 'rejected':
        return 'Rejected';
      default:
        return 'Not Submitted';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'text-success';
      case 'pending':
        return 'text-primary';
      case 'rejected':
        return 'text-destructive';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">KYC Verification</h1>
          <p className="text-muted-foreground">View and manage your identity verification status</p>
        </div>

        <div className="max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle>Verification Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center gap-4 p-6 bg-secondary rounded-lg">
                  {getStatusIcon(kycStatus?.status || 'not_submitted')}
                  <div className="flex-1">
                    <p className="font-semibold mb-1">
                      Status: <span className={getStatusColor(kycStatus?.status || 'not_submitted')}>
                        {getStatusText(kycStatus?.status || 'not_submitted')}
                      </span>
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {kycStatus?.status === 'verified' && 'Your identity has been verified successfully'}
                      {kycStatus?.status === 'pending' && 'Your verification is being reviewed by our team'}
                      {kycStatus?.status === 'rejected' && 'Your verification was rejected. Please resubmit with correct information'}
                      {!kycStatus?.status && 'Complete your KYC verification to unlock all features'}
                    </p>
                  </div>
                </div>

                {kycStatus?.status === 'verified' && (
                  <div className="space-y-3">
                    <h3 className="font-semibold">Verified Information</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="text-muted-foreground">Full Name:</div>
                      <div>{kycStatus.fullName}</div>
                      <div className="text-muted-foreground">Date of Birth:</div>
                      <div>{kycStatus.dateOfBirth}</div>
                      <div className="text-muted-foreground">Verification Date:</div>
                      <div>{new Date(kycStatus.verifiedAt).toLocaleDateString()}</div>
                    </div>
                  </div>
                )}

                {kycStatus?.status === 'rejected' && kycStatus?.rejectionReason && (
                  <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                    <p className="text-sm font-semibold text-destructive mb-2">Rejection Reason:</p>
                    <p className="text-sm">{kycStatus.rejectionReason}</p>
                  </div>
                )}

                {(!kycStatus?.status || kycStatus?.status === 'rejected') && (
                  <Link href="/onboarding">
                    <Button className="w-full">
                      {kycStatus?.status === 'rejected' ? 'Resubmit Verification' : 'Start Verification'}
                    </Button>
                  </Link>
                )}

                <div className="pt-4 border-t border-border">
                  <h3 className="font-semibold mb-3">What you can do with KYC verification:</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-success mt-0.5" />
                      <span>Unlimited trading volume</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-success mt-0.5" />
                      <span>Higher withdrawal limits</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-success mt-0.5" />
                      <span>Access to advanced trading features</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-success mt-0.5" />
                      <span>Priority customer support</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
