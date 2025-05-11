"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { DashboardLayout } from '@/components/layouts/dashboard-layout';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  AlertCircle,
  CalendarIcon,
  FileTextIcon,
  ListChecksIcon,
  TrophyIcon,
  UsersIcon,
  VoteIcon,
  ClipboardCheckIcon,
} from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function CandidateDashboard() {
  const { user, userRole } = useAuth();
  const router = useRouter();

  // Redirect if not authenticated or not a candidate
  useEffect(() => {
    if (!user && typeof window !== 'undefined') {
      router.push('/login');
    } else if (userRole && userRole !== 'candidate' && typeof window !== 'undefined') {
      // If user is logged in but not a candidate, redirect to appropriate dashboard
      router.push(userRole === 'admin' ? '/admin-dashboard' : '/voter-dashboard');
    }
  }, [user, userRole, router]);

  // Mock data for demo
  const applications = [
    {
      id: '1',
      electionTitle: 'National General Election 2025',
      status: 'pending',
      submitted: '2025-01-15',
      completionPercentage: 70,
    },
    {
      id: '2',
      electionTitle: 'State Assembly Elections - Karnataka',
      status: 'approved',
      submitted: '2024-12-10',
      completionPercentage: 100,
    },
  ];

  const eligibleElections = [
    {
      id: '1',
      title: 'National General Election 2025',
      deadline: '2025-03-15',
      status: 'open',
      daysRemaining: 15,
    },
    {
      id: '2',
      title: 'Local Municipal Elections',
      deadline: '2025-04-20',
      status: 'open',
      daysRemaining: 50,
    },
  ];

  const results = [
    {
      id: '1',
      election: 'State Assembly Elections 2024',
      position: 'MLA - Constituency 42',
      result: 'Lost',
      votes: 45689,
      totalVotes: 98765,
      percentage: 46.3,
      winner: 'Jane Smith',
      winnerVotes: 49823,
      winnerPercentage: 50.4,
    },
  ];

  const pendingTasks = [
    { id: '1', title: 'Upload ID Proof', description: 'Required for verification' },
    { id: '2', title: 'Complete Profile', description: 'Add your bio and qualifications' },
    { id: '3', title: 'Upload Campaign Manifesto', description: 'PDF document (max 10MB)' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Candidate Dashboard</h1>
          <p className="text-muted-foreground">Manage your election candidacy and applications</p>
        </div>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Complete your profile</AlertTitle>
          <AlertDescription>
            Your candidate profile is incomplete. Please add all required documents to apply for elections.
          </AlertDescription>
        </Alert>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Applications</CardTitle>
              <FileTextIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{applications.length}</div>
              <p className="text-xs text-muted-foreground">
                {applications.filter(a => a.status === 'approved').length} approved, {applications.filter(a => a.status === 'pending').length} pending
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full" onClick={() => router.push('/candidate-dashboard/applications')}>
                View Applications
              </Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Eligible Elections</CardTitle>
              <VoteIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{eligibleElections.length}</div>
              <p className="text-xs text-muted-foreground">
                You can apply for {eligibleElections.length} upcoming election(s)
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full" onClick={() => router.push('/candidate-dashboard/elections')}>
                View Eligible Elections
              </Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Profile Completion</CardTitle>
              <UsersIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">70%</div>
              <Progress value={70} className="h-2 mt-2" />
              <p className="text-xs text-muted-foreground mt-2">
                Complete your profile to apply for more elections
              </p>
            </CardContent>
            <CardFooter>
              <Button size="sm" className="w-full" onClick={() => router.push('/candidate-dashboard/profile')}>
                Complete Profile
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Your Applications</CardTitle>
              <CardDescription>Status of your election applications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {applications.map((application) => (
                <div
                  key={application.id}
                  className="flex flex-col rounded-lg border p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{application.electionTitle}</p>
                    <Badge variant={application.status === 'approved' ? 'default' : 'secondary'}>
                      {application.status === 'approved' ? 'Approved' : 'Under Review'}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Completion</span>
                      <span>{application.completionPercentage}%</span>
                    </div>
                    <Progress value={application.completionPercentage} className="h-2" />
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <CalendarIcon className="inline mr-1 h-3 w-3" />
                    Submitted on {new Date(application.submitted).toLocaleDateString()}
                  </div>
                  <Button variant="outline" size="sm">View Details</Button>
                </div>
              ))}
            </CardContent>
            <CardFooter>
              <Button className="w-full">Apply for New Election</Button>
            </CardFooter>
          </Card>

          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Pending Tasks</CardTitle>
              <CardDescription>Complete these items to move forward</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {pendingTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="space-y-1">
                    <p className="font-medium">{task.title}</p>
                    <p className="text-sm text-muted-foreground">{task.description}</p>
                  </div>
                  <Button variant="outline" size="sm">
                    <ClipboardCheckIcon className="mr-2 h-4 w-4" />
                    Complete
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Previous Election Results</CardTitle>
            <CardDescription>Your performance in past elections</CardDescription>
          </CardHeader>
          <CardContent>
            {results.length > 0 ? (
              <div className="space-y-6">
                {results.map((result) => (
                  <div key={result.id} className="space-y-4 rounded-lg border p-6">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium">{result.election}</h3>
                        <Badge variant={result.result === 'Won' ? 'default' : 'secondary'} className="ml-2">
                          {result.result}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{result.position}</p>
                    </div>
                    
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Your votes</span>
                          <span className="font-medium">{result.votes.toLocaleString()} ({result.percentage}%)</span>
                        </div>
                        <Progress value={result.percentage} className="h-2" />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Winner ({result.winner})</span>
                          <span className="font-medium">{result.winnerVotes.toLocaleString()} ({result.winnerPercentage}%)</span>
                        </div>
                        <Progress value={result.winnerPercentage} className="h-2 bg-muted" indicatorClassName="bg-green-500" />
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button variant="outline" size="sm">
                        <TrophyIcon className="mr-2 h-4 w-4" />
                        View Detailed Results
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <ListChecksIcon className="h-12 w-12 text-muted" />
                <h3 className="mt-4 text-lg font-medium">No past election results</h3>
                <p className="mt-2 text-sm text-muted-foreground max-w-md">
                  You haven't participated in any previous elections yet. Apply for upcoming elections to see your results here.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}