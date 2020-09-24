### Quality Policy
> Describe your Quality Policy in detail for this Sprint (remember what I ask you to do when I talk about the "In your Project" part in the lectures and what is mentioned after each assignment (in due course you will need to fill out all of them, check which ones are needed for each Deliverable). You should keep adding things to this file and adjusting your policy as you go.

**GitHub Workflow** (due Feb 2nd)
  > Your Workflow
  
-Copied judiciously from suggestions made by amehlhase316:

–Branch from Development (Dev) into your US# branch (this branch shouldalways have a working version).

–Work on your new US branch.

–Each commit message needs to state the US and task number and describe what you did.

–Push to the remote repo often.

–When User Story is done, merge current Dev into your US branch.

–Test if everything works after Dev was merged into your US branch

–If everything worked well, create a Pull Request to Dev and request a reviewfrom someone to double check.

–Reviews of Pull Requests should include good comments.

–If the Dev is in good shape, create a Pull Request to Master (this should bea fast forward and the Dev should be thoroughly tested).

–Team members should review and write comments on the Request.

–One designated team member then merges the Pull Request into the masterbranch

–Merging into master should always be a fast forward (as should into Dev).

-The complicated merges should all be resolved on User Story branches.

**Unit Tests Blackbox** (due start Sprint 2)
  > Blackbox tests will be created in the src/test.java package
  > Each test scenario will have comments related to what is being tested and why
  > The majority of the testing should be Whitebox testing as code is accessible

**Unit Tests Whitebox** (due Feb 25th)
  > Whitebox tests will be created in the src/test.java package
  > Whitebox testing should be performed on any new or modified methods
  > 90% code coverage is expected with all tests passed


**Code Review** (due Feb 25th)
  > As part of a pull request into Development, informal code reviews shall be performed by the person completing the pull request.    

  > Include a checklist/questions list which every developer will need to fill out/answer when creating a Pull Request to the Dev branch.

  > For the purposes of code reviews, the code review checklist and coding standards used in class shall be utilized.  All NEW or MODIFIED code will be expected to comply.  A completed checklist can be drag-and-dropped into the comment section of the pull request.  This shall be done for all pull requests merging into Development where code has been altered.

**Static Analysis**  (due start Sprint 3)
  > It is expected that CheckStyle and SpotBugs will be run individually on the code prior to pushing it to github.  These should be configured to run automatically through Gradle as well.  YOU are responsible for correcting identified errors in your own code.  Any errors identified in another person's code will be added to the code review checklist.   

**Continuous Integration**  (due start Sprint 3)
  > Travis-CI is up and running already.  If you push code to github, it is YOUR responsibility to ensure the code passes the Travis checks.  If a build fails for any reason, fixing that build fail will take priority over tackling a new task/user story.  Ensure your build passes BEFORE initiating a pull request to Development.  There should be zero reason Development build will ever fail.  These bugs should be worked out beforehand.