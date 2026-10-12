                <textarea
                  ref={textAreaRef}
                  value={typedText}
                  onChange={handleTyping}
                  className="relative min-h-[300px] w-full text-transparent resize-none bg-transparent p-0 font-inherit leading-relaxed tracking-wide focus:outline-none focus:ring-0"
                  style={{ 
                    wordSpacing: "0.25em",
                    caretColor: theme.cursor
                  }}
                  placeholder=""
                  disabled={!isTestRunning && hasStarted}
                  onPaste={(e) => e.preventDefault()}
                  onContextMenu={(e) => e.preventDefault()}
                />
              </div>

              {/* Stats display */}
              <div className="flex justify-between text-sm" style={{ color: theme.text }}>
                <div>WPM: <span className="font-bold">{wpm}</span></div>
                <div>Accuracy: <span className="font-bold">{accuracy.toFixed(2)}%</span></div>
                <div>Progress: <span className="font-bold">{Math.round(overallProgress)}%</span></div>
              </div>
            </div>
          )}

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Typing Test Results</DialogTitle>
                <DialogDescription>Here's how you performed:</DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <p className="text-xl mb-2">
                  Your WPM: <span className="font-bold">{wpm}</span>
                </p>
                <p className="text-xl mb-4">
                  Your Accuracy: <span className="font-bold">{accuracy.toFixed(2)}%</span>
                </p>
                
                {(challengeMode && activeChallenge) && (
                  <div className="mt-4 p-4 rounded-lg border">
                    <div className="flex items-center mb-2">
                      <Trophy className="w-6 h-6 mr-2 text-blue-500" />
                      <h3 className="text-lg font-bold">Challenge Results</h3>
                    </div>
                    
                    {isChallengeCompleted ? (
                      <div className="flex flex-col items-center text-center">
                        <div className="flex items-center text-blue-600 mb-2">
                          <Target className="w-6 h-6 mr-2" />
                          <span className="font-bold">Challenge Completed!</span>
                        </div>
                        <p>You've earned: {activeChallenge.reward}</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center text-center">
                        <div className="flex items-center text-red-600 mb-2">
                          <AlertTriangle className="w-6 h-6 mr-2" />
                          <span className="font-bold">Challenge Failed</span>
                        </div>
                        <p>
                          Target: {activeChallenge.type === "speed" 
                            ? `${activeChallenge.target} WPM` 
                            : activeChallenge.type === "accuracy" 
                              ? `${activeChallenge.target}% Accuracy` 
                              : activeChallenge.type === "endurance" 
                                ? `${activeChallenge.target} minutes` 
                                : activeChallenge.type === "code"
                                  ? `${activeChallenge.target}% Accuracy`
                                  : `${activeChallenge.target}% Precision`}
                        </p>
                        <p>Try again! You can do it!</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <DialogFooter className="flex flex-col sm:flex-row gap-2">
                {challengeMode && (
                  <Button onClick={goToChallenges} variant="outline">
                    Back to Challenges
                  </Button>
                )}
                <Button onClick={handleReset} variant="premium" className="font-medium">
                  Try Again
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
      <Toaster position="bottom-right" reverseOrder={false} />
    </div>
  )
}

// Wrap with Suspense boundary for the export
export default function TypingTestPage() {
  return (
    <Suspense fallback={<TypingTestLoading />}>
      <TypingTest />
    </Suspense>
  );
}
