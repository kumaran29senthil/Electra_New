"use client";

import { useState } from 'react';
import { DashboardLayout } from '@/components/layouts/dashboard-layout';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { CalendarIcon, CheckCircle2Icon, ClockIcon, UsersIcon, VoteIcon } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// Mock candidates for an election
const candidatesData = [
  { id: '1', name: 'John Smith', party: 'Progress Party', manifesto: '/manifesto1.pdf' },
  { id: '2', name: 'Jane Doe', party: 'Forward Alliance', manifesto: '/manifesto2.pdf' },
  { id: '3', name: 'Mike Johnson', party: 'Citizens Movement', manifesto: '/manifesto3.pdf' },
  { id: '4', name: 'Sarah Williams', party: 'Unity Coalition', manifesto: '/manifesto4.pdf' },
];

export default function ElectionsPage() {
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null);
  const [isVoteConfirmed, setIsVoteConfirmed] = useState(false);
  const [isVerificationRequired, setIsVerificationRequired] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [isFaceVerifying, setIsFaceVerifying] = useState(false);
  const [verificationSuccessful, setVerificationSuccessful] = useState(false);
  const [voteCast, setVoteCast] = useState(false);

  // Mock active elections
  const activeElections = [
    {
      id: '1',
      title: 'City Municipal Corporation Election',
      type: 'Local',
      startDate: '2025-02-25',
      endDate: '2025-02-28',
      registeredVoters: 25000,
      voted: 12000,
      candidates: candidatesData,
      hasVoted: false,
    },
    {
      id: '2',
      title: 'University Student Council',
      type: 'Institutional',
      startDate: '2025-02-24',
      endDate: '2025-03-01',
      registeredVoters: 5000,
      voted: 1500,
      candidates: candidatesData.slice(0, 3),
      hasVoted: true,
    },
  ];

  // Mock past elections
  const pastElections = [
    {
      id: '3',
      title: 'State Assembly Election 2024',
      type: 'State',
      date: '2024-11-15',
      voted: true,
      result: 'Jane Doe (Forward Alliance)',
    },
    {
      id: '4',
      title: 'Local District Council Election',
      type: 'Local',
      date: '2024-08-22',
      voted: false,
      result: 'Mike Johnson (Citizens Movement)',
    },
  ];

  const handleSelectCandidate = (candidateId: string) => {
    setSelectedCandidate(candidateId);
  };

  const handleVoteClick = () => {
    setDialogOpen(true);
  };

  const handleFaceVerification = () => {
    setIsFaceVerifying(true);
    
    // Simulate face verification process
    setTimeout(() => {
      setIsFaceVerifying(false);
      setVerificationSuccessful(true);
      setIsVerificationRequired(false);
    }, 2000);
  };

  const handleConfirmVote = () => {
    setDialogOpen(false);
    setConfirmationOpen(true);
    setVoteCast(true);
    
    // Simulate blockchain confirmation
    setTimeout(() => {
      setIsVoteConfirmed(true);
    }, 3000);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Active Elections</h1>
          <p className="text-muted-foreground">Participate in ongoing elections securely via blockchain</p>
        </div>
        
        <Tabs defaultValue="active">
          <TabsList>
            <TabsTrigger value="active">Active Elections</TabsTrigger>
            <TabsTrigger value="past">Past Elections</TabsTrigger>
          </TabsList>
          
          <TabsContent value="active" className="pt-4 space-y-6">
            {activeElections.map((election) => (
              <Card key={election.id} className={election.hasVoted ? 'border-muted' : ''}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{election.title}</CardTitle>
                      <CardDescription>
                        {election.type} Election
                      </CardDescription>
                    </div>
                    <div>
                      <Badge variant={election.hasVoted ? 'secondary' : 'default'}>
                        {election.hasVoted ? 'Voted' : 'Active'}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {new Date(election.startDate).toLocaleDateString()} - {new Date(election.endDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ClockIcon className="h-4 w-4 text-muted-foreground" />
                      <span>Ends in {Math.ceil((new Date(election.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <UsersIcon className="h-4 w-4 text-muted-foreground" />
                      <span>Turnout: {Math.round((election.voted / election.registeredVoters) * 100)}%</span>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Voter Turnout</span>
                      <span>{election.voted.toLocaleString()} of {election.registeredVoters.toLocaleString()}</span>
                    </div>
                    <Progress value={(election.voted / election.registeredVoters) * 100} className="h-2" />
                  </div>
                  
                  {!election.hasVoted ? (
                    <>
                      <div className="pt-2">
                        <h3 className="font-medium mb-3">Select a candidate:</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {election.candidates.map((candidate) => (
                            <div
                              key={candidate.id}
                              className={`border rounded-md p-4 cursor-pointer transition-colors ${
                                selectedCandidate === candidate.id
                                  ? 'border-primary bg-primary/5'
                                  : 'hover:bg-accent'
                              }`}
                              onClick={() => handleSelectCandidate(candidate.id)}
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-medium">{candidate.name}</p>
                                  <p className="text-sm text-muted-foreground">{candidate.party}</p>
                                </div>
                                {selectedCandidate === candidate.id && (
                                  <CheckCircle2Icon className="h-5 w-5 text-primary" />
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex justify-end pt-2">
                        <Button
                          onClick={handleVoteClick}
                          disabled={!selectedCandidate}
                        >
                          <VoteIcon className="mr-2 h-4 w-4" />
                          Cast Vote
                        </Button>
                      </div>
                    </>
                  ) : (
                    <Alert>
                      <CheckCircle2Icon className="h-4 w-4" />
                      <AlertTitle>Vote Cast</AlertTitle>
                      <AlertDescription>
                        You have already voted in this election. Your vote has been securely recorded on the blockchain.
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            ))}
          </TabsContent>
          
          <TabsContent value="past" className="pt-4 space-y-6">
            {pastElections.map((election) => (
              <Card key={election.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{election.title}</CardTitle>
                      <CardDescription>
                        {election.type} Election • {new Date(election.date).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <Badge variant={election.voted ? 'default' : 'secondary'}>
                      {election.voted ? 'Voted' : 'Did not vote'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-muted-foreground">Winner</p>
                        <p className="font-medium">{election.result}</p>
                      </div>
                      <Button variant="outline">View Results</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Face Verification Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Voter Verification Required</DialogTitle>
            <DialogDescription>
              Before casting your vote, we need to verify your identity using facial recognition.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {isVerificationRequired ? (
              <div className="border rounded-md p-6 flex flex-col items-center justify-center">
                {!isFaceVerifying ? (
                  <>
                    <div className="h-32 w-32 rounded-full bg-muted flex items-center justify-center mb-4">
                      <UsersIcon className="h-16 w-16 text-muted-foreground" />
                    </div>
                    <p className="text-center text-sm mb-4">
                      Please ensure you are in a well-lit area and position your face in the center of the camera.
                    </p>
                    <Button onClick={handleFaceVerification}>
                      Start Face Verification
                    </Button>
                  </>
                ) : (
                  <div className="py-8 flex flex-col items-center">
                    <div className="h-16 w-16 rounded-full border-4 border-primary border-t-transparent animate-spin mb-4"></div>
                    <p>Verifying your identity...</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="border rounded-md p-6 flex flex-col items-center justify-center bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-900">
                <CheckCircle2Icon className="h-16 w-16 text-green-500 mb-4" />
                <p className="text-lg font-medium text-center">Verification Successful</p>
                <p className="text-center text-sm text-muted-foreground mb-4">
                  Your identity has been verified. You can now proceed to cast your vote.
                </p>
              </div>
            )}
            
            <div className="pt-4 space-y-2">
              <h4 className="font-medium">Your Selection:</h4>
              <div className="border rounded-md p-4">
                <p className="font-medium">
                  {activeElections[0].candidates.find(c => c.id === selectedCandidate)?.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {activeElections[0].candidates.find(c => c.id === selectedCandidate)?.party}
                </p>
              </div>
            </div>
          </div>
          
          <DialogFooter className="flex justify-between items-center">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleConfirmVote} 
              disabled={isVerificationRequired}
            >
              Confirm Vote
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Vote Confirmation Dialog */}
      <Dialog open={confirmationOpen} onOpenChange={setConfirmationOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Vote Confirmation</DialogTitle>
            <DialogDescription>
              Your vote is being securely recorded on the blockchain.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {!isVoteConfirmed ? (
              <div className="border rounded-md p-6 flex flex-col items-center justify-center">
                <div className="h-16 w-16 rounded-full border-4 border-primary border-t-transparent animate-spin mb-4"></div>
                <p className="text-center">Processing your vote on the blockchain...</p>
                <p className="text-xs text-muted-foreground text-center mt-2">
                  This might take a few moments as we ensure your vote is securely recorded.
                </p>
              </div>
            ) : (
              <div className="border rounded-md p-6 flex flex-col items-center justify-center bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-900">
                <CheckCircle2Icon className="h-16 w-16 text-green-500 mb-4" />
                <p className="text-lg font-medium text-center">Vote Successfully Cast!</p>
                <p className="text-center text-sm text-muted-foreground mb-4">
                  Your vote has been securely recorded on the blockchain. Thank you for participating in this election.
                </p>
                <div className="w-full p-3 bg-background rounded border text-xs font-mono overflow-auto">
                  <p className="truncate">Transaction ID: 0x7F8e9a1b2C3d4e5F6g7H8i9J0k1L2m3N4o5P6q7R8s9T0</p>
                  <p className="text-muted-foreground mt-1">Block #: 14,523,891</p>
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button onClick={() => setConfirmationOpen(false)} disabled={!isVoteConfirmed}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}