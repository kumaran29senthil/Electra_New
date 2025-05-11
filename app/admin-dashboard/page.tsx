"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layouts/dashboard-layout';
import { useAuth } from '@/context/auth-context';

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle } from 'lucide-react';

import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from 'recharts';

export default function AdminDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check if the user is authenticated and is an admin
    if (typeof window !== 'undefined') {
      const adminAuth = localStorage.getItem('adminAuthenticated');
      if (!adminAuth) {
        router.push('/login');
      } else {
        setIsAdmin(true);
      }
    }
  }, [router]);

  if (!isAdmin) {
    return null;
  }

  // Mock data for dashboard
  const votingStats = [
    { name: 'Jan', votes: 2500 },
    { name: 'Feb', votes: 3000 },
    { name: 'Mar', votes: 4000 },
    { name: 'Apr', votes: 2780 },
    { name: 'May', votes: 1890 },
    { name: 'Jun', votes: 2390 },
    { name: 'Jul', votes: 3490 },
  ];

  const activeElections = [
    {
      id: '1',
      title: 'City Municipal Corporation Election',
      startDate: '2025-02-25',
      endDate: '2025-02-28',
      registeredVoters: 25000,
      votesRecorded: 12000,
      candidatesCount: 8,
      status: 'active',
    },
    {
      id: '2',
      title: 'University Student Council',
      startDate: '2025-02-24',
      endDate: '2025-03-01',
      registeredVoters: 5000,
      votesRecorded: 1500,
      candidatesCount: 12,
      status: 'active',
    },
  ];

  const upcomingElections = [
    {
      id: '3',
      title: 'National General Election 2025',
      startDate: '2025-05-15',
      endDate: '2025-05-16',
      registeredVoters: 900000000,
      candidatesCount: 543,
    },
    {
      id: '4',
      title: 'State Assembly Elections - Karnataka',
      startDate: '2025-03-10',
      endDate: '2025-03-10',
      registeredVoters: 50000000,
      candidatesCount: 224,
    },
  ];

  const pendingApprovals = [
    { id: '1', name: 'John Doe', election: 'National General Election', constituency: 'Central District 5', submittedOn: '2025-02-20' },
    { id: '2', name: 'Jane Smith', election: 'National General Election', constituency: 'Western Zone 3', submittedOn: '2025-02-19' },
    { id: '3', name: 'Michael Johnson', election: 'State Assembly Elections', constituency: 'Northern District 2', submittedOn: '2025-02-18' },
    { id: '4', name: 'Sarah Williams', election: 'State Assembly Elections', constituency: 'Southern Zone 7', submittedOn: '2025-02-21' },
  ];

  const fraudAlerts = [
    { id: '1', type: 'Multiple Login Attempts', location: 'Central District', severity: 'high', time: '2025-02-26 14:30' },
    { id: '2', type: 'Facial Recognition Failure', location: 'Northern Zone', severity: 'medium', time: '2025-02-26 15:45' },
    { id: '3', type: 'Unusual Voting Pattern', location: 'Western District', severity: 'high', time: '2025-02-26 13:15' },
  ];

  const genderDistribution = [
    { name: 'Male', value: 53 },
    { name: 'Female', value: 46 },
    { name: 'Other', value: 1 },
  ];

  const COLORS = ['#0088FE', '#FF8042', '#00C49F'];

  const ageDistribution = [
    { name: '18-25', value: 15 },
    { name: '26-35', value: 25 },
    { name: '36-45', value: 20 },
    { name: '46-60', value: 25 },
    { name: '60+', value: 15 },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Election Commission Dashboard</h1>
          <p className="text-muted-foreground">Monitor elections, approve candidates, and ensure electoral integrity</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Elections</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeElections.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming Elections</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{upcomingElections.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Candidate Approvals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingApprovals.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Fraud Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">{fraudAlerts.length}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Voting Turnout</CardTitle>
              <CardDescription>Daily voting statistics for the past month</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={votingStats} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      borderColor: 'hsl(var(--border))',
                      color: 'hsl(var(--card-foreground))',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="votes"
                    stroke="hsl(var(--chart-1))"
                    fillOpacity={1}
                    fill="url(#colorUv)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Active Elections</CardTitle>
              <CardDescription>Currently running elections</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {activeElections.map(election => (
                  <div key={election.id} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{election.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(election.startDate).toLocaleDateString()} - {new Date(election.endDate).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge>Active</Badge>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Voter Turnout</span>
                        <span>{Math.round((election.votesRecorded / election.registeredVoters) * 100)}%</span>
                      </div>
                      <Progress value={(election.votesRecorded / election.registeredVoters) * 100} className="h-2" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Registered Voters:</span>{' '}
                        <span className="font-medium">{election.registeredVoters.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Votes Cast:</span>{' '}
                        <span className="font-medium">{election.votesRecorded.toLocaleString()}</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button variant="outline" size="sm">View Details</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Pending Candidate Approvals</CardTitle>
              <CardDescription>Candidates awaiting verification</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingApprovals.slice(0, 3).map((candidate) => (
                  <div
                    key={candidate.id}
                    className="flex flex-col rounded-lg border p-4 space-y-2"
                  >
                    <div className="flex justify-between">
                      <p className="font-medium">{candidate.name}</p>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <p>{candidate.election}</p>
                      <p>{candidate.constituency}</p>
                      <p>Submitted: {new Date(candidate.submittedOn).toLocaleDateString()}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" className="flex-1">Review</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">View All Pending Approvals</Button>
            </CardFooter>
          </Card>

          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Fraud Alerts</CardTitle>
              <CardDescription>Potential security issues detected</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {fraudAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`flex flex-col rounded-lg border p-4 space-y-2 ${alert.severity === 'high' ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : ''}`}
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-medium flex items-center">
                        {alert.severity === 'high' && <AlertTriangle className="w-4 h-4 text-red-500 mr-1" />}
                        {alert.type}
                      </p>
                      <Badge variant={alert.severity === 'high' ? 'destructive' : 'secondary'}>
                        {alert.severity}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <p>Location: {alert.location}</p>
                      <p>Time: {alert.time}</p>
                    </div>
                    <Button size="sm">Investigate</Button>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">View All Alerts</Button>
            </CardFooter>
          </Card>

          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Voter Demographics</CardTitle>
              <CardDescription>Current election participation statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="gender">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="gender">Gender</TabsTrigger>
                  <TabsTrigger value="age">Age Groups</TabsTrigger>
                </TabsList>
                
                <TabsContent value="gender" className="pt-4">
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={genderDistribution}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {genderDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value) => [`${value}%`, 'Percentage']}
                          contentStyle={{
                            backgroundColor: 'hsl(var(--card))',
                            borderColor: 'hsl(var(--border))',
                            color: 'hsl(var(--card-foreground))',
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>
                
                <TabsContent value="age" className="pt-4">
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={ageDistribution}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip
                          formatter={(value) => [`${value}%`, 'Percentage']}
                          contentStyle={{
                            backgroundColor: 'hsl(var(--card))',
                            borderColor: 'hsl(var(--border))',
                            color: 'hsl(var(--card-foreground))',
                          }}
                        />
                        <Legend />
                        <Bar dataKey="value" name="Percentage" fill="hsl(var(--chart-2))" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Elections</CardTitle>
            <CardDescription>Scheduled elections requiring preparation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {upcomingElections.map(election => (
                <div key={election.id} className="rounded-lg border p-6 space-y-4">
                  <div>
                    <h3 className="font-medium">{election.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {new Date(election.startDate).toLocaleDateString()} - {new Date(election.endDate).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Registered Voters</p>
                      <p className="font-medium">{election.registeredVoters.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Candidates</p>
                      <p className="font-medium">{election.candidatesCount}</p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button variant="outline" className="flex-1">Manage</Button>
                    <Button className="flex-1">Edit Schedule</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Create New Election</Button>
          </CardFooter>
        </Card>
      </div>
    </DashboardLayout>
  );
}