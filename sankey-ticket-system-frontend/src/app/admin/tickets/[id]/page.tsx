'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { ticketApi } from '@/lib/ticketApi';
import { authApi } from '@/lib/authApi';
import { Ticket, TicketHistory, User } from '@/types';
import { Card, Button, PriorityBadge, StatusBadge, Spinner, Select } from '@/components/ui';
import TicketComments from '@/components/tickets/TicketComments';
import TicketHistoryList from '@/components/tickets/TicketHistoryList';
import { formatDateTime } from '@/lib/utils';
import toast from 'react-hot-toast';
import { RiArrowLeftLine, RiTimeLine, RiUserLine, RiTeamLine } from 'react-icons/ri';

export default function AdminTicketDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [history, setHistory] = useState<TicketHistory[]>([]);
  const [vendors, setVendors] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVendor, setSelectedVendor] = useState('');
  const [assigning, setAssigning] = useState(false);

  useEffect(() => { loadAll(); }, [id]);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [t, h, v] = await Promise.all([
        ticketApi.getById(id),
        ticketApi.getHistory(id),
        authApi.getVendors(),
      ]);
      setTicket(t);
      setHistory(h);
      setVendors(v);
      // Pre-select current vendor in dropdown if already assigned
      if (t.vendorId) setSelectedVendor(t.vendorId);
    } catch {
      toast.error('Failed to load ticket');
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async () => {
    if (!selectedVendor) return toast.error('Select a vendor first');
    setAssigning(true);
    try {
      await ticketApi.assignVendor(id, selectedVendor);
      // FIX: show success with vendor name, not ID
      const vendorName = vendors.find(v => v.id === selectedVendor)?.name || selectedVendor;
      toast.success(`Assigned to ${vendorName}`);
      loadAll();
    } catch {
      toast.error('Failed to assign vendor');
    } finally {
      setAssigning(false);
    }
  };

  // FIX: look up vendor name from the vendors list using the ticket's vendorId
  const assignedVendorName = ticket?.vendorId
    ? vendors.find(v => v.id === ticket.vendorId)?.name || ticket.vendorId
    : null;

  // Admin can reassign if ticket is OPEN or ASSIGNED; cannot reassign after work has started
  const canAssign = ticket && ['OPEN', 'ASSIGNED'].includes(ticket.status);

  if (loading) return (
    <DashboardLayout>
      <div className="flex justify-center py-20"><Spinner size="lg" /></div>
    </DashboardLayout>
  );

  if (!ticket) return (
    <DashboardLayout><p className="text-slate-400">Ticket not found</p></DashboardLayout>
  );

  const vendorOptions = [
    { value: '', label: '— Select a vendor —' },
    ...vendors.map(v => ({ value: v.id, label: v.name })),
  ];

  return (
    <DashboardLayout>
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors mb-4"
        >
          <RiArrowLeftLine /> Back to Tickets
        </button>
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>
              {ticket.title}
            </h1>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <PriorityBadge priority={ticket.priority} />
              <StatusBadge status={ticket.status} />
              <span className="text-xs text-slate-500 font-mono">#{ticket.id.slice(-8)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <h3 className="font-semibold text-white mb-3" style={{ fontFamily: 'var(--font-display)' }}>
              Description
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
              {ticket.description || 'No description provided.'}
            </p>
            {ticket.resolveReason && (
              <div className="mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <p className="text-xs font-semibold text-emerald-400 mb-1">Vendor Resolution Note</p>
                <p className="text-sm text-emerald-200">{ticket.resolveReason}</p>
              </div>
            )}
          </Card>
          <TicketComments 
  ticketId={id}
  ticketTitle={ticket.title}
  ticketDescription={ticket.description}
  userRole="ADMIN"
/>
        </div>

        <div className="space-y-4">

          {/* ASSIGN VENDOR CARD */}
          <Card className="p-5">
            <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider flex items-center gap-2"
              style={{ fontFamily: 'var(--font-display)' }}>
              <RiTeamLine className="text-violet-400" /> Assign Vendor
            </h3>

            {/* FIX: show vendor NAME not truncated ID */}
            {assignedVendorName && (
              <div className="mb-3 px-3 py-2 rounded-lg bg-violet-500/10 border border-violet-500/20">
                <p className="text-xs text-violet-300">
                  Currently assigned: <span className="font-semibold">{assignedVendorName}</span>
                </p>
              </div>
            )}

            {/* FIX: allow reassignment when ticket is OPEN or ASSIGNED */}
            {canAssign ? (
              <div className="space-y-3">
                <Select
                  value={selectedVendor}
                  onChange={(e) => setSelectedVendor(e.target.value)}
                  options={vendorOptions}
                />
                <Button onClick={handleAssign} loading={assigning} className="w-full" size="sm">
                  {ticket.vendorId ? 'Reassign Vendor' : 'Assign Vendor'}
                </Button>
              </div>
            ) : (
              <button
                disabled
                className="w-full px-4 py-2.5 rounded-xl text-sm font-medium text-slate-500 bg-slate-700/40 border border-slate-600/30 cursor-not-allowed"
              >
                🔒 Cannot reassign after work started
              </button>
            )}
          </Card>

          {/* DETAILS CARD */}
          <Card className="p-5">
            <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider"
              style={{ fontFamily: 'var(--font-display)' }}>
              Details
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <RiTimeLine className="text-slate-500 flex-shrink-0" />
                <span className="text-slate-400">Created:</span>
                <span className="text-slate-200 ml-auto text-right text-xs">{formatDateTime(ticket.createdAt)}</span>
              </div>
              <div className="flex items-center gap-2">
                <RiUserLine className="text-blue-400 flex-shrink-0" />
                <span className="text-slate-400">Buyer ID:</span>
                <span className="text-slate-200 ml-auto font-mono text-xs">{ticket.buyerId?.slice(0, 10)}…</span>
              </div>
              {/* FIX: show vendor name, not raw ID */}
              {assignedVendorName && (
                <div className="flex items-center gap-2">
                  <RiTeamLine className="text-violet-400 flex-shrink-0" />
                  <span className="text-slate-400">Vendor:</span>
                  <span className="text-violet-300 ml-auto text-sm font-medium">{assignedVendorName}</span>
                </div>
              )}
              {ticket.resolvedAt && (
                <div className="flex items-center gap-2">
                  <RiTimeLine className="text-emerald-400 flex-shrink-0" />
                  <span className="text-slate-400">Resolved:</span>
                  <span className="text-emerald-300 ml-auto text-xs">{formatDateTime(ticket.resolvedAt)}</span>
                </div>
              )}
              {ticket.resolutionTimeHours != null && (
                <div className="px-3 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                  <p className="text-xs text-emerald-300">Resolved in {ticket.resolutionTimeHours}h</p>
                </div>
              )}
            </div>
          </Card>

          {/* HISTORY CARD */}
          <Card className="p-5">
            <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider"
              style={{ fontFamily: 'var(--font-display)' }}>
              History
            </h3>
            <TicketHistoryList history={history} />
          </Card>

        </div>
      </div>
    </DashboardLayout>
  );
}