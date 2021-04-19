### Quality Policy
**GitHub Workflow** 
 
–Branch from Development (Dev) into your US# branch (this branch shouldalways have a working version).

  >Branches should be labeled "US-XX" applicable to the user story. If creating a branch for User Story 8, branch should be named "US-8", etc.

–Work on your new US branch.

  >If a new branch is required for a User Story subtask, ensure the subtask branch is created from within the applicable user story branch.

  >Subtask branches may encounter unintended merge conflicts when merging back to the parent branch, due to multiple people working within the branch.  It is the responsibility of the merger to satisfactorily resolve all conflicts.

–Each commit message needs to state the US and task number and describe what you did.

  >Example: I work on User Story 99 which adds OAuth login credentials.  A commit message would say "US-99, adds OAuth functionality to user login"

–Push to the remote repo often.

–When User Story is done, merge current development branch into the User Story branch

–Test if everything works after Dev was merged into your US branch

  >It is the merger's responsibility to ensure all conflicts are addressed

–If everything worked well, create a Pull Request to Dev and request a review from someone to double check.

–Reviews of Pull Requests should include good comments.

-Merging into Master should only occur at the end of each sprint, after all User Stories have been merged into development branch with no outstanding errors or conflicts

  >If the Dev is in good shape, create a Pull Request to Master (this should be a fast forward and the Dev should be thoroughly tested).

–Team members should review and write comments on the Request.

–One designated team member then merges the Pull Request into the masterbranch

–Merging into master should always be a fast forward (as should into Dev).

-The complicated merges should all be resolved on User Story branches.

*-If a User Story branch merge contains NO CODE, and is only a documentation modification, the branch may be merged into development following the process above, but you may exclude the code reviews and pull request review*

**Unit Tests Blackbox** 
  > Blackbox tests will be created in the src/test package
  > Each test scenario will have comments related to what is being tested and why
  > The majority of the testing should be Whitebox testing as code is accessible

**Unit Tests Whitebox** 
  > Whitebox tests will be created in the src/test package
  > Whitebox testing should be performed on any new or modified methods
  > 90% code coverage is expected with all tests passed


**Code Review** 
  > As part of a pull request into Development, informal code reviews shall be performed by the person completing the pull request.    

  > Include a checklist/questions list which every developer will need to fill out/answer when creating a Pull Request to the Dev branch.

  > For the purposes of code reviews, the code review checklist and coding standards used in class shall be utilized.  All NEW or MODIFIED code will be expected to comply.  A completed checklist can be drag-and-dropped into the comment section of the pull request.  This shall be done for all pull requests merging into Development where code has been altered.


**Continuous Integration**  
  > Travis-CI tests must pass.