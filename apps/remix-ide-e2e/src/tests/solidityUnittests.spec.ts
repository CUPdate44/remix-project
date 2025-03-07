'use strict'

import { NightwatchBrowser } from 'nightwatch'
import init from '../helpers/init'

module.exports = {

  before: function (browser: NightwatchBrowser, done) {
    init(browser, done)
  },

  '@sources': function () {
    return sources
  },

  'Should launch solidity unit test plugin': function (browser: NightwatchBrowser) {
    browser.waitForElementPresent('*[data-id="verticalIconsKindfilePanel"]')
      .clickLaunchIcon('filePanel')
      .addFile('simple_storage.sol', sources[0]['simple_storage.sol'])
      .addFile('ks2a.sol', sources[0]['ks2a.sol'])
      .clickLaunchIcon('pluginManager')
      .scrollAndClick('*[data-id="pluginManagerComponentActivateButtonsolidityUnitTesting"]')
      .click('*[data-id="verticalIconsKindsolidityUnitTesting"]')
      .waitForElementPresent('*[data-id="sidePanelSwapitTitle"]')
      .assert.containsText('*[data-id="sidePanelSwapitTitle"]', 'SOLIDITY UNIT TESTING')
  },

  'Should generate test file': function (browser: NightwatchBrowser) {
    browser.waitForElementPresent('*[data-id="verticalIconsKindfilePanel"]')
      .clickLaunchIcon('filePanel')
      .openFile('simple_storage.sol')
      .click('*[data-id="verticalIconsKindsolidityUnitTesting"]')
      .waitForElementPresent('*[data-id="testTabGenerateTestFile"]')
      .click('*[data-id="testTabGenerateTestFile"]')
      .waitForElementPresent('*[title="tests/simple_storage_test.sol"]')
      .clickLaunchIcon('filePanel')
      .pause(10000)
      .openFile('tests/simple_storage_test.sol')
      .removeFile('tests/simple_storage_test.sol', 'default_workspace')
  },

  'Should run simple unit test `simple_storage_test.sol` ': function (browser: NightwatchBrowser) {
    browser.waitForElementPresent('*[data-id="verticalIconsKindfilePanel"]')
      .addFile('tests/simple_storage_test.sol', sources[0]['tests/simple_storage_test.sol'])
      .click('*[data-id="verticalIconsKindsolidityUnitTesting"]')
      .waitForElementPresent('*[data-id="testTabCheckAllTests"]')
      .click('*[data-id="testTabCheckAllTests"]')
      .clickElementAtPosition('.singleTestLabel', 1)
      .scrollAndClick('*[data-id="testTabRunTestsTabRunAction"]')
      .waitForElementContainsText('*[data-id="testTabSolidityUnitTestsOutput"]', 'MyTest (tests/simple_storage_test.sol)', 120000)
      .waitForElementContainsText('*[data-id="testTabSolidityUnitTestsOutput"]', '✓ Initial value should be100', 120000)
      .waitForElementContainsText('*[data-id="testTabSolidityUnitTestsOutput"]', '✓ Value is set200', 120000)
      .waitForElementContainsText('*[data-id="testTabSolidityUnitTestsOutput"]', '✘ Should fail for wrong value200', 120000)
      .waitForElementContainsText('*[data-id="testTabSolidityUnitTestsOutput"]', 'Passing: 2', 120000)
      .waitForElementContainsText('*[data-id="testTabSolidityUnitTestsOutput"]', 'Failing: 1', 120000)
      .waitForElementContainsText('*[data-id="testTabSolidityUnitTestsOutput"]', 'FAIL MyTest (tests/simple_storage_test.sol)', 120000)
  },

  'Should run advance unit test using natspec and experimental ABIEncoderV2 `ks2b_test.sol` ': function (browser: NightwatchBrowser) {
    browser.waitForElementPresent('*[data-id="verticalIconsKindfilePanel"]')
      .clickLaunchIcon('filePanel')
      .addFile('tests/ks2b_test.sol', sources[0]['tests/ks2b_test.sol'])
      .click('*[data-id="verticalIconsKindsolidityUnitTesting"]')
      .waitForElementPresent('*[data-id="testTabCheckAllTests"]')
      .click('*[data-id="testTabCheckAllTests"]')
      .clickElementAtPosition('.singleTestLabel', 2)
      .scrollAndClick('*[data-id="testTabRunTestsTabRunAction"]')
      .waitForElementContainsText('*[data-id="testTabSolidityUnitTestsOutput"]', 'tests/ks2b_test.sol', 120000)
      .waitForElementContainsText('*[data-id="testTabSolidityUnitTestsOutput"]', '✓ Check project exists', 120000)
      .waitForElementContainsText('*[data-id="testTabSolidityUnitTestsOutput"]', '✘ Check wrong project owner', 120000)
      .waitForElementContainsText('*[data-id="testTabSolidityUnitTestsOutput"]', '✘ Check wrong sender', 120000)
      .waitForElementContainsText('*[data-id="testTabSolidityUnitTestsOutput"]', '✘ Check wrong value', 120000)
      .waitForElementContainsText('*[data-id="testTabSolidityUnitTestsOutput"]', '✓ Check project is fundable', 120000)
      .waitForElementContainsText('*[data-id="testTabSolidityUnitTestsOutput"]', 'owner is incorrect', 120000)
      .waitForElementContainsText('*[data-id="testTabSolidityUnitTestsOutput"]', 'wrong sender', 120000)
      .waitForElementContainsText('*[data-id="testTabSolidityUnitTestsOutput"]', 'wrong value', 120000)
  },

  'Should stop unit tests during test execution` ': function (browser: NightwatchBrowser) {
    browser.waitForElementPresent('*[data-id="verticalIconsKindfilePanel"]')
      .waitForElementPresent('*[data-id="testTabRunTestsTabRunAction"]')
      .clickElementAtPosition('.singleTestLabel', 0)
      .clickElementAtPosition('.singleTestLabel', 1)
      .scrollAndClick('*[data-id="testTabRunTestsTabRunAction"]')
      .pause(2000)
      .click('*[data-id="testTabRunTestsTabStopAction"]')
      .waitForElementContainsText('*[data-id="testTabSolidityUnitTestsOutput"]', 'tests/ks2b_test.sol', 200000)
      .notContainsText('*[data-id="testTabSolidityUnitTestsOutput"]', 'tests/4_Ballot_test.sol')
      .notContainsText('*[data-id="testTabSolidityUnitTestsOutput"]', 'tests/simple_storage_test.sol')
      .waitForElementContainsText('*[data-id="testTabTestsExecutionStopped"]', 'The test execution has been stopped', 60000)
  },

  'Should fail on compilation, open file on error click, not disappear error': function (browser: NightwatchBrowser) {
    browser.waitForElementPresent('*[data-id="verticalIconsKindfilePanel"]')
      .addFile('tests/compilationError_test.sol', sources[0]['compilationError_test.sol'])
      .click('div[title="default_workspace/tests/compilationError_test.sol"] span[class="close"]')
      .clickLaunchIcon('solidityUnitTesting')
      .pause(2000)
      .click('*[data-id="testTabCheckAllTests"]')
      .clickElementAtPosition('.singleTestLabel', 3)
      .scrollAndClick('*[data-id="testTabRunTestsTabRunAction"]')
      .waitForElementContainsText('*[data-id="testTabSolidityUnitTestsOutput"]', 'SyntaxError: No visibility specified', 120000)
      .waitForElementContainsText('*[data-id="testTabTestsExecutionStoppedError"]', 'The test execution has been stopped because of error(s) in your test file', 120000)
      .click('*[data-id="tests/compilationError_test.sol"]')
      .pause(1000)
      .getEditorValue((content) => browser.assert.ok(content.indexOf('contract failOnCompilation {') !== -1))
      // Verify that compilation error is still present after a file is opened
      // usually, tests result is cleared on opening a new file
      .verify.elementPresent('*[data-id="tests/compilationError_test.sol"]')
  },

  'Should fail on deploy': function (browser: NightwatchBrowser) {
    browser.waitForElementPresent('*[data-id="verticalIconsKindfilePanel"]')
      .addFile('tests/deployError_test.sol', sources[0]['tests/deployError_test.sol'])
      .clickLaunchIcon('filePanel')
      .openFile('tests/deployError_test.sol')
      .clickLaunchIcon('solidityUnitTesting')
      .click('*[data-id="testTabCheckAllTests"]')
      .clickElementAtPosition('.singleTestLabel', 4)
      .scrollAndClick('*[data-id="testTabRunTestsTabRunAction"]')
      .waitForElementContainsText('*[data-id="testTabSolidityUnitTestsOutput"]', 'contract deployment failed after trying twice', 120000)
  },

  'Should fail when parameters are passed to method in test contract': function (browser: NightwatchBrowser) {
    browser.waitForElementPresent('*[data-id="verticalIconsKindfilePanel"]')
      .addFile('tests/methodFailure_test.sol', sources[0]['tests/methodFailure_test.sol'])
      .clickLaunchIcon('filePanel')
      .openFile('tests/methodFailure_test.sol')
      .clickLaunchIcon('solidityUnitTesting')
      .click('*[data-id="testTabCheckAllTests"]')
      .clickElementAtPosition('.singleTestLabel', 5)
      .scrollAndClick('*[data-id="testTabRunTestsTabRunAction"]')
      .waitForElementContainsText('*[data-id="testTabSolidityUnitTestsOutput"]', 'Method \'add\' can not have parameters inside a test contract', 120000)
  },

  'Changing current path': function (browser: NightwatchBrowser) {
    browser
      .waitForElementPresent('*[data-id="verticalIconsKindfilePanel"]')
      .addFile('myTests/simple_storage_test.sol', sources[0]['tests/simple_storage_test.sol'])
      .clickLaunchIcon('solidityUnitTesting')
      .setValue('*[data-id="uiPathInput"]', 'myTests')
      .click('*[data-id="testTabGenerateTestFolder"]')
      .clickElementAtPosition('.singleTest', 0, { forceSelectIfUnselected: true })
      .scrollAndClick('*[data-id="testTabRunTestsTabRunAction"]')
      .waitForElementPresent('*[data-id="testTabSolidityUnitTestsOutputheader"]', 60000)
      .waitForElementPresent('*[data-id="testTabSolidityUnitTestsOutput"]')
      .clearValue('*[data-id="uiPathInput"]')
      .setValue('*[data-id="uiPathInput"]', 'tests')
      .click('*[data-id="testTabGenerateTestFolder"]')
  },

  'Changing current path when workspace changed': function (browser: NightwatchBrowser) {
    browser
      .waitForElementPresent('*[data-id="verticalIconsKindfilePanel"]')
      .clickLaunchIcon('settings')
      .clickLaunchIcon('solidityUnitTesting')
      .waitForElementPresent('*[data-id="uiPathInput"]', 3000)
      .clearValue('*[data-id="uiPathInput"]')
      .setValue('*[data-id="uiPathInput"]', 'tests1')
      .click('*[data-id="testTabGenerateTestFolder"]')
      .clickLaunchIcon('filePanel')
      // creating a new workspace
      .click('*[data-id="workspaceCreate"]')
      .waitForElementVisible('*[data-id="modalDialogCustomPromptTextCreate"]')
      // eslint-disable-next-line dot-notation
      .execute(function () { document.querySelector('*[data-id="modalDialogCustomPromptTextCreate"]')['value'] = 'workspace_new' })
      .click('*[data-id="workspacesModalDialogModalDialogModalFooter-react"] .modal-ok')
      .click('*[data-id="workspacesSelect"] option[value="workspace_new"]')
      // end of creating
      .clickLaunchIcon('solidityUnitTesting')
      .pause(2000)
      .verify.attributeEquals('*[data-id="uiPathInput"]', 'value', 'tests')
  },

  'Solidity Unit tests Basic': function (browser: NightwatchBrowser) {
    browser
      .waitForElementPresent('*[data-id="verticalIconsKindfilePanel"]')
      .clickLaunchIcon('filePanel')
      .click('*[data-id="treeViewLitreeViewItemcontracts"]')
      .openFile('contracts/3_Ballot.sol')
      .clickLaunchIcon('solidityUnitTesting')
      .pause(2000)
      .verify.attributeEquals('*[data-id="uiPathInput"]', 'value', 'tests')
      .scrollAndClick('#runTestsTabRunAction')
      .waitForElementVisible('*[data-id="testTabSolidityUnitTestsOutputheader"]', 120000)
      .waitForElementPresent('#solidityUnittestsOutput div[class^="testPass"]', 60000)
      .waitForElementContainsText('#solidityUnittestsOutput', 'tests/4_Ballot_test.sol', 60000)
      .waitForElementContainsText('#solidityUnittestsOutput', '✓ Check winning proposal', 60000)
      .waitForElementContainsText('#solidityUnittestsOutput', '✓ Check winnin proposal with return value', 60000)
  },

  'Solidity Unit tests with hardhat console log': function (browser: NightwatchBrowser) {
    browser
      .waitForElementPresent('*[data-id="verticalIconsKindfilePanel"]')
      .addFile('tests/hhLogs_test.sol', sources[0]['tests/hhLogs_test.sol'])
      .clickLaunchIcon('solidityUnitTesting')
      .waitForElementVisible('*[id="singleTesttests/4_Ballot_test.sol"]', 60000)
      .click('*[id="singleTesttests/4_Ballot_test.sol"]')
      .click('#runTestsTabRunAction')
      .pause(2000)
      .waitForElementVisible('*[data-id="testTabSolidityUnitTestsOutputheader"]', 120000)
      .waitForElementPresent('#solidityUnittestsOutput div[class^="testPass"]', 60000)
      .waitForElementContainsText('#solidityUnittestsOutput', 'tests/hhLogs_test.sol', 60000)
      .assert.containsText('#journal > div:nth-child(3) > span > div', 'Before all:')
      .assert.containsText('#journal > div:nth-child(3) > span > div', 'Inside beforeAll')
      .assert.containsText('#journal > div:nth-child(4) > span > div', 'Check sender:')
      .assert.containsText('#journal > div:nth-child(4) > span > div', 'msg.sender is 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4')
      .assert.containsText('#journal > div:nth-child(5) > span > div', 'Check int logs:')
      .assert.containsText('#journal > div:nth-child(5) > span > div', '10 20')
      .assert.containsText('#journal > div:nth-child(5) > span > div', 'Number is 25')
      .openFile('tests/hhLogs_test.sol')
      .removeFile('tests/hhLogs_test.sol', 'workspace_new')
  },

  'Solidity Unit tests with hardhat console log for EVM revert': function (browser: NightwatchBrowser) {
    browser
      .waitForElementPresent('*[data-id="verticalIconsKindfilePanel"]')
      .addFile('tests/ballotFailedLog_test.sol', sources[0]['tests/ballotFailedLog_test.sol'])
      .clickLaunchIcon('solidityUnitTesting')
      .waitForElementVisible('*[id="singleTesttests/4_Ballot_test.sol"]', 60000)
      .click('*[id="singleTesttests/4_Ballot_test.sol"]')
      .click('#runTestsTabRunAction')
      .pause(2000)
      .waitForElementVisible('*[data-id="testTabSolidityUnitTestsOutputheader"]', 120000)
      .waitForElementContainsText('#solidityUnittestsOutput', 'tests/ballotFailedLog_test.sol', 60000)
      .assert.containsText('#journal > div:nth-child(6) > span > div', 'Check winning proposal:')
      .assert.containsText('#journal > div:nth-child(6) > span > div', 'Inside checkWinningProposal')
      .openFile('tests/ballotFailedLog_test.sol')
      .removeFile('tests/ballotFailedLog_test.sol', 'workspace_new')
  },

  'Debug failed test using debugger': function (browser: NightwatchBrowser) {
    browser
      .waitForElementPresent('*[data-id="verticalIconsKindfilePanel"]')
      .addFile('tests/ballotFailedDebug_test.sol', sources[0]['tests/ballotFailedDebug_test.sol'])
      .clickLaunchIcon('solidityUnitTesting')
      .waitForElementVisible('*[id="singleTesttests/4_Ballot_test.sol"]', 60000)
      .click('*[id="singleTesttests/4_Ballot_test.sol"]')
      .click('#runTestsTabRunAction')
      .waitForElementVisible('*[data-id="testTabSolidityUnitTestsOutputheader"]', 120000)
      .waitForElementContainsText('#solidityUnittestsOutput', 'tests/ballotFailedDebug_test.sol', 60000)
      .waitForElementContainsText('#solidityUnittestsOutput', '✘ Check winning proposal', 60000)
      .waitForElementContainsText('#solidityUnittestsOutput', '✓ Check winnin proposal with return value', 60000)
      .click('.fa-bug')
      .waitForElementContainsText('*[data-id="sidePanelSwapitTitle"]', 'DEBUGGER', 60000)
      .waitForElementContainsText('*[data-id="functionPanel"]', 'checkWinningProposal()', 60000)
      .click('*[data-id="dropdownPanelSolidityLocals"]')
      .waitForElementContainsText('*[data-id="solidityLocals"]', 'no locals', 60000)
      // eslint-disable-next-line dot-notation
      .execute(function () { document.getElementById('slider')['value'] = '235' }) // It only moves slider to 235 but vm traces are not updated
      .setValue('*[data-id="slider"]', new Array(1).fill(browser.Keys.RIGHT_ARROW))
      .waitForElementContainsText('*[data-id="functionPanel"]', 'checkWinningProposal()', 60000)
      .waitForElementContainsText('*[data-id="functionPanel"]', 'vote(proposal)', 60000)
      .pause(2000)
      .checkVariableDebug('soliditylocals', locals)
      .clickLaunchIcon('filePanel')
      .pause(2000)
      .openFile('tests/ballotFailedDebug_test.sol')
      .removeFile('tests/ballotFailedDebug_test.sol', 'workspace_new')
  },

  'Basic Solidity Unit tests with local compiler': function (browser: NightwatchBrowser) {
    browser
      .clickLaunchIcon('solidity')
      .setSolidityCompilerVersion('builtin')
      .openFile('contracts/3_Ballot.sol')
      .clickLaunchIcon('pluginManager')
      .scrollAndClick('[data-id="pluginManagerComponentDeactivateButtonsolidityUnitTesting"]')
      .pause(2000)
      .scrollAndClick('[data-id="pluginManagerComponentActivateButtonsolidityUnitTesting"]')
      .clickLaunchIcon('solidityUnitTesting')
      .scrollAndClick('#runTestsTabRunAction')
      .waitForElementVisible('*[data-id="testTabSolidityUnitTestsOutputheader"]', 120000)
      .waitForElementPresent('#solidityUnittestsOutput div[class^="testPass"]', 60000)
      .waitForElementContainsText('#solidityUnittestsOutput', 'tests/4_Ballot_test.sol', 60000)
      .waitForElementContainsText('#solidityUnittestsOutput', '✓ Check winning proposal', 60000)
      .waitForElementContainsText('#solidityUnittestsOutput', '✓ Check winnin proposal with return value', 60000)
      .end()
  }
}

const sources = [
  {
    'simple_storage.sol': {
      content: `
      pragma solidity >=0.4.22 <0.9.0;

      contract SimpleStorage {
        uint public storedData;
      
        constructor() {
          storedData = 100;
        }
      
        function set(uint x) public {
          storedData = x;
        }
      
        function get() public view returns (uint retVal) {
          return storedData;
        }
      }
        `
    },
    'tests/simple_storage_test.sol': {
      content: `
      pragma solidity >=0.4.22 <0.9.0;
      import "remix_tests.sol";
      import "../simple_storage.sol";

      contract MyTest {
        SimpleStorage foo;

        function beforeEach() public {
          foo = new SimpleStorage();
        }

        function initialValueShouldBe100() public returns (bool) {
          return Assert.equal(foo.get(), 100, "initial value is not correct");
        }

        function valueIsSet200() public returns (bool) {
          foo.set(200);
          return Assert.equal(foo.get(), 200, "value is not 200");
        }

        function shouldFailForWrongValue200() public returns (bool) {
          foo.set(300);
          return Assert.equal(foo.get(), 200, "value is not 200");
        }
      }
        `
    },
    'ks2a.sol': {
      content: `
      pragma solidity >=0.4.22 <0.9.0;
      contract Kickstarter {
          enum State { Started, Completed }
      
          struct Project {
              address owner;
              string name;
              uint goal;
              uint fundsAvailable; // added
              uint amountContributed; // added
              State state;
              mapping(address => uint) funders; // added
          }
          uint numProjects;
          Project[] public projects;
      
          constructor() {
          }
      
          function createProject(string memory name, uint goal) public {
              projects.push(); // new line
              Project storage project = projects[projects.length - 1];
              project.name = name;
              project.goal = goal;
              project.owner = msg.sender;
              project.state = State.Started;
          }
          
          function fundProject(uint projectId) payable public {
          Project storage project = projects[projectId];
              // require project exists
              // PLEASE CHECK / or erase
              // not this: require(projects[projectId].exists, "the project must exist to be funded");
      
              // require for... underflow/overflow protection
              project.funders[msg.sender] += msg.value;
              project.amountContributed += msg.value;
              project.fundsAvailable += msg.value;
      
              if (project.amountContributed >= project.goal) {
                  project.state = State.Completed;
              }
          }
          
          // this function is here because we can't use web3 when using the VM
          function getContractBalance() public view returns(uint balance) {
              return address(this).balance;
          }
            
      }
        `
    },
    'tests/ks2b_test.sol': {
      content: `
      pragma solidity >=0.4.22 <0.9.0;
      pragma experimental ABIEncoderV2;

      import "remix_tests.sol"; // this import is automatically injected by Remix.
      import "remix_accounts.sol";
      import "../ks2a.sol";

      contract kickstarterTest {
          enum State { Started, Completed }

          Kickstarter kickstarter;
          
          function beforeAll () public {
            kickstarter = new Kickstarter();
            kickstarter.createProject("ProjectA", 123000);
            kickstarter.createProject("ProjectB", 100);
          }
      
          /// #sender: account-1
          /// #value: 10000000
          function checkProjectExists () public payable {
              (address owner, string memory name, uint goal, uint fundsAvailable, uint amountContributed, Kickstarter.State state) = kickstarter.projects(0);
              Assert.equal(name, "ProjectA", "project name is incorrect");
              Assert.equal(goal, 123000, "funding goal is incorrect");
              Assert.equal(owner, address(this), "owner is incorrect");
              Assert.equal(msg.sender, TestsAccounts.getAccount(1), "wrong sender");
              Assert.equal(msg.value, 10000000, "wrong value");
          }

          /// #sender: account-1
          /// #value: 10000000
          function checkWrongProjectOwner () public payable {
            (address owner,,,,,) = kickstarter.projects(0);
            Assert.equal(owner, TestsAccounts.getAccount(0), "owner is incorrect"); //failing case
          }

          /// #sender: account-1
          /// #value: 10000000
          function checkWrongSender () public payable {
            Assert.equal(msg.sender, TestsAccounts.getAccount(0), "wrong sender"); //failing case
          }

          /// #sender: account-1
          /// #value: 10000000
          function checkWrongValue () public payable {
            Assert.equal(msg.value, 5000000, "wrong value"); //failing case
          }

          function checkProjectIsFundable () public {
              kickstarter.fundProject{value:120000}(0);
              (address owner, string memory name, uint goal, uint fundsAvailable, uint amountContributed, Kickstarter.State state) = kickstarter.projects(0);
              Assert.equal(amountContributed, 120000, "contributed amount is incorrect");
          }
          
      }
        `
    },
    'compilationError_test.sol': {
      content: `
      pragma solidity ^0.8.0;
      
      contract failOnCompilation {
        fallback() {

        }
      }
        `
    },
    'tests/deployError_test.sol': {
      content: `
      pragma solidity ^0.7.0;

      contract failingDeploy {
          constructor() {
              revert('Deploy Failed');
          }
      }
        `
    },
    'tests/methodFailure_test.sol': {
      content: `
      pragma solidity ^0.7.0;

      contract methodfailure {
        function add(uint a, uint b) public {
           uint c = a+b;
           Assert.equal(a+b, c, "wrong value");
        }
      } 
        `
    },
    'tests/ballotFailedDebug_test.sol': {
      content: `// SPDX-License-Identifier: GPL-3.0

      pragma solidity >=0.7.0 <0.9.0;
      import "remix_tests.sol"; // this import is automatically injected by Remix.
      import "../contracts/3_Ballot.sol";
      
      contract BallotTest {
         
          bytes32[] proposalNames;
         
          Ballot ballotToTest;
          function beforeAll () public {
              proposalNames.push(bytes32("candidate1"));
              ballotToTest = new Ballot(proposalNames);
          }
          
          function checkWinningProposal () public {
              ballotToTest.vote(1); // This will revert the transaction
              Assert.equal(ballotToTest.winningProposal(), uint(0), "proposal at index 0 should be the winning proposal");
          }
          
          function checkWinninProposalWithReturnValue () public view returns (bool) {
              return ballotToTest.winningProposal() == 0;
          }
      }`
    },
    'tests/ballotFailedLog_test.sol': {
      content: `// SPDX-License-Identifier: GPL-3.0

      pragma solidity >=0.7.0 <0.9.0;
      import "remix_tests.sol"; // this import is automatically injected by Remix.
      import "../contracts/3_Ballot.sol";

      import "hardhat/console.sol";
      
      contract BallotTest {
         
          bytes32[] proposalNames;
         
          Ballot ballotToTest;
          function beforeAll () public {
              proposalNames.push(bytes32("candidate1"));
              ballotToTest = new Ballot(proposalNames);
          }
          
          function checkWinningProposal () public {
              console.log("Inside checkWinningProposal");
              ballotToTest.vote(1); // This will revert the transaction
          }
      }`
    },
    'tests/hhLogs_test.sol': {
      content: `// SPDX-License-Identifier: GPL-3.0

      pragma solidity >=0.7.0 <0.9.0;
      import "remix_tests.sol"; // this import is automatically injected by Remix.
      import "hardhat/console.sol";
      
      contract hhLogs {
        
          function beforeAll () public {
              console.log('Inside beforeAll');
          }
          
          function checkSender () public {
              console.log('msg.sender is %s', msg.sender);
              Assert.ok(true, "should be true");
          }

          function checkIntLogs () public {
            console.log(10,20);
            console.log('Number is %d', 25);
            Assert.ok(true, "should be true");
        }
      }`
    }
  }
]

const locals = {
  sender: {
    value: {
      weight: {
        value: '1',
        type: 'uint256'
      },
      voted: {
        value: false,
        type: 'bool'
      },
      delegate: {
        value: '0x0000000000000000000000000000000000000000',
        type: 'address'
      },
      vote: {
        value: '0',
        type: 'uint256'
      }
    },
    type: 'struct Ballot.Voter'
  },
  proposal: {
    value: '1',
    type: 'uint256'
  }
}
