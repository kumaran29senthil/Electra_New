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
import {
  AlertCircle,
  CalendarIcon,
  CheckSquareIcon,
  ClockIcon,
  UsersIcon,
  VoteIcon,
} from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function VoterDashboard() {
  const { user, userRole } = useAuth();
  const router = useRouter();

  // Redirect if not authenticated or not a voter
  useEffect(() => {
    if (!user && typeof window !== 'undefined') {
      router.push('/login');
    } else if (userRole && userRole !== 'voter' && typeof window !== 'undefined') {
      // If user is logged in but not a voter, redirect to appropriate dashboard
      router.push(userRole === 'admin' ? '/admin-dashboard' : '/candidate-dashboard');
    }
  }, [user, userRole, router]);

  // Mock data for demo
  const upcomingElections = [
    {
      id: '1',
      title: 'National General Election 2025',
      date: '2025-05-15',
      status: 'upcoming',
      daysRemaining: 45,
    },
    {
      id: '2',
      title: 'State Assembly Elections - Karnataka',
      date: '2025-03-10',
      status: 'upcoming',
      daysRemaining: 10,
    },
  ];

  const activeElections = [
    {
      id: '3',
      title: 'City Municipal Corporation Election',
      date: '2025-02-28',
      status: 'active',
      endsIn: '2 days',
    },
  ];

  const recentActivity = [
    {
      id: '1',
      type: 'verification',
      title: 'ID Verified',
      date: '2025-02-25',
      description: 'Your digital voter ID has been verified',
    },
    {
      id: '2',
      type: 'registration',
      title: 'Registration Completed',
      date: '2025-02-23',
      description: 'You have successfully registered on Electra',
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Voter Dashboard</h1>
          <p className="text-muted-foreground">Welcome to your secure voting portal</p>
        </div>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Important</AlertTitle>
          <AlertDescription>
            Your identity verification is pending. Please complete face verification to access all features.
          </AlertDescription>
        </Alert>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Elections</CardTitle>
              <VoteIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeElections.length}</div>
              <p className="text-xs text-muted-foreground">
                You can currently vote in {activeElections.length} election(s)
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full" onClick={() => router.push('/voter-dashboard/elections')}>
                View Active Elections
              </Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming Elections</CardTitle>
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{upcomingElections.length}</div>
              <p className="text-xs text-muted-foreground">
                {upcomingElections.length} election(s) scheduled in the next 3 months
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full" onClick={() => router.push('/voter-dashboard/upcoming')}>
                View Schedule
              </Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Verification Status</CardTitle>
              <CheckSquareIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-500">Pending</div>
              <p className="text-xs text-muted-foreground">
                Complete identity verification to enable voting
              </p>
            </CardContent>
            <CardFooter>
              <Button size="sm" className="w-full">
                Complete Verification
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Active Elections</CardTitle>
              <CardDescription>Elections you can currently vote in</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {activeElections.length > 0 ? (
                activeElections.map((election) => (
                  <div
                    key={election.id}
                    className="flex items-center justify-between rounded-lg border p-4"
                  >
                    <div className="space-y-1">
                      <p className="font-medium">{election.title}</p>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <ClockIcon className="mr-1 h-4 w-4" />
                        Ends in {election.endsIn}
                      </div>
                    </div>
                    <Button>Vote Now</Button>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No active elections at the moment.</p>
              )}
            </CardContent>
          </Card>

          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Upcoming Elections</CardTitle>
              <CardDescription>Elections scheduled in the coming months</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingElections.map((election) => (
                <div
                  key={election.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="space-y-1">
                    <p className="font-medium">{election.title}</p>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <CalendarIcon className="mr-1 h-4 w-4" />
                      {new Date(election.date).toLocaleDateString()} ({election.daysRemaining} days)
                    </div>
                  </div>
                  <Button variant="outline">Details</Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest actions and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start">
                  <div className="mt-0.5 flex-shrink-0 rounded-full bg-blue-50 p-1.5 text-blue-700 dark:bg-blue-800/20 dark:text-blue-400">
                    {activity.type === 'verification' ? (
                      <CheckSquareIcon className="h-5 w-5" />
                    ) : (
                      <UsersIcon className="h-5 w-5" />
                    )}
                  </div>
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium">{activity.title}</p>
                    <p className="text-sm text-muted-foreground">{activity.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(activity.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}