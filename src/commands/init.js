/**
 * @since 2016-11-16 10:20
 * @author vivaxy
 */

import path from 'path';
import execa from 'execa';
import Listr from 'listr';
import inquirer from 'inquirer';
import fse from 'fs-extra';
import gitUsername from 'git-user-name';

import fileExists from '../file/fileExists';
import directoryExists from '../file/directoryExists';
import isDirectoryEmpty from '../file/isDirectoryEmpty';
import * as configManager from '../lib/configManager';
import updateScaffoldStat from '../lib/updateScaffoldStat';
import checkGitRepository from '../git/checkGitRepository';
import checkGitClean from '../git/getClean';
import getGitRemoteURL from '../git/getRemoteURL';
import getCommitHash from '../git/getCommitHash';
import { GT_HOME, MODULES_FOLDER, GIT_FOLDER, PROJECT_GT_FILE } from '../config';

import getCopyFiles from '../presets/copyFiles';
import getWriteFile from '../presets/writeFile';
import getUpdateFile from '../presets/updateFile';
import getUpdateFiles from '../presets/updateFiles';
import getWriteJson from '../presets/writeJson';
import getUpdateJson from '../presets/updateJson';
import getRemoveFiles from '../presets/removeFiles';
import getAddScaffoldInfo from '../presets/addScaffoldInfo';

const cwd = process.cwd();

const gitCloneTask = async({ selectedScaffoldRepo, selectedScaffoldFolder }) => {
    const [repoURL, commitIsh] = selectedScaffoldRepo.split('#');
    const clone = await execa('git', ['clone', repoURL, selectedScaffoldFolder]);
    if (clone.code !== 0) {
        throw new Error(`clone error:
selectedScaffoldRepo: ${selectedScaffoldRepo}
repoURL: ${repoURL}
${clone.stderr}`);
    }
    process.chdir(selectedScaffoldFolder);
    if (commitIsh) {
        await execa('git', ['checkout', commitIsh]);
        if (clone.code !== 0) {
            throw new Error(`checkout error:
selectedScaffoldRepo: ${selectedScaffoldRepo}
commitIsh: ${commitIsh}
${clone.stderr}`);
        }
    }
    process.chdir(cwd);
};

const gitPullTask = async({ selectedScaffoldFolder }) => {
    process.chdir(selectedScaffoldFolder);
    const gitClean = await checkGitClean();
    if (!gitClean) {
        await execa('git', ['checkout', '.']);
    }
    await execa('git', ['pull']);
    process.chdir(cwd);
};

const npmInstallTask = async({ selectedScaffoldFolder }) => {
    process.chdir(selectedScaffoldFolder);
    const yarnLockExists = await fileExists(path.join(selectedScaffoldFolder, 'yarn.lock'));
    if (yarnLockExists) {
        await execa('yarn', ['install']);
    } else {
        await execa('npm', ['install']);
    }
    process.chdir(cwd);
};

const prepareForCopyProjectFiles = async(ctx) => {
    const { selectedScaffoldFolder } = ctx;
    const copyInfo = {
        project: { folder: cwd },
        scaffold: { folder: selectedScaffoldFolder },
    };
    const copyFiles = getCopyFiles(copyInfo);
    const files = await fse.readdir(selectedScaffoldFolder);
    const excludeGitFiles = files.filter((file) => {
        return file !== GIT_FOLDER && file !== MODULES_FOLDER;
    });
    copyFiles(excludeGitFiles);
};

const prepareForScaffoldGT = async(ctx) => {
    const { selectedScaffoldName, selectedScaffoldFolder, projectGTFilePath } = ctx;

    const projectGT = require(projectGTFilePath); // eslint-disable-line global-require, import/no-dynamic-require
    let projectGit = null;

    const isGitRepository = await checkGitRepository();
    if (isGitRepository) {
        const repositoryURL = await getGitRemoteURL();
        projectGit = { repositoryURL, username: gitUsername() };
    }

    process.chdir(selectedScaffoldFolder);
    const headHash = await getCommitHash();
    process.chdir(cwd);

    const GTInfo = {
        project: { folder: cwd, name: cwd.split(path.sep).pop(), git: projectGit },
        scaffold: { folder: selectedScaffoldFolder, name: selectedScaffoldName, git: { headHash } },
    };

    GTInfo.presets = {
        copyFiles: getCopyFiles(GTInfo),
        writeFile: getWriteFile(GTInfo),
        updateFile: getUpdateFile(GTInfo),
        writeJson: getWriteJson(GTInfo),
        updateJson: getUpdateJson(GTInfo),
        removeFiles: getRemoveFiles(GTInfo),
        updateFiles: getUpdateFiles(GTInfo),
        addScaffoldInfo: getAddScaffoldInfo(GTInfo),
    };

    ctx.projectGT = projectGT; // eslint-disable-line no-param-reassign
    ctx.GTInfo = GTInfo; // eslint-disable-line no-param-reassign
};

const runScaffoldGT = async({ projectGT, GTInfo }) => {
    return await projectGT.init(GTInfo);
};

const updateStat = async({ selectedScaffoldName }) => {
    await updateScaffoldStat(selectedScaffoldName);
};

let projectGTFileExists = false;

export const command = 'init';
export const describe = 'Choose a scaffold to init your new project';
export const builder = {};
export const handler = async() => {
    // check dir empty?
    const isCurrentDirectoryEmpty = await isDirectoryEmpty(cwd, ['.git']);
    if (!isCurrentDirectoryEmpty) {
        const continueResult = await inquirer.prompt([
            {
                type: 'confirm',
                name: 'continue',
                message: 'Current directory is not empty, files will be overridden. Continue?',
                default: true,
            },
        ]);
        if (!continueResult.continue) {
            return;
        }
    }

    const userConfig = configManager.read();
    const scaffoldConfig = userConfig.scaffold;
    const scaffoldNameList = configManager.readScaffoldListByStatOrder();

    const answer = await inquirer.prompt([
        {
            type: 'list',
            name: 'scaffold',
            message: 'Choose a scaffold...',
            choices: scaffoldNameList,
        },
    ]);

    const selectedScaffoldName = answer.scaffold;
    const selectedScaffoldRepo = scaffoldConfig[selectedScaffoldName].repo;
    const selectedScaffoldFolder = path.join(GT_HOME, selectedScaffoldName);

    const projectGTFilePath = path.join(GT_HOME, selectedScaffoldName, PROJECT_GT_FILE);

    const gitTasks = [
        {
            title: 'Clone scaffold.',
            task: gitCloneTask,
            skip: async() => {
                const selectedScaffoldFolderExists = await directoryExists(selectedScaffoldFolder);
                if (selectedScaffoldFolderExists) {
                    return 'scaffold exists';
                }
                return undefined;
            },
        },
        { title: 'Pull scaffold.', task: gitPullTask },
    ];

    const preTasks = [];
    const postTasks = [{ title: 'Finishing.', task: updateStat }];

    const gitListr = new Listr(gitTasks);

    let listrContext = { selectedScaffoldName, selectedScaffoldRepo, selectedScaffoldFolder, projectGTFilePath };

    try {
        listrContext = await gitListr.run(listrContext);

        projectGTFileExists = await fileExists(projectGTFilePath);

        if (projectGTFileExists) {
            preTasks.push(
                { title: 'Install scaffold npm packages.', task: npmInstallTask },
                { title: 'Prepare for scaffold GT.', task: prepareForScaffoldGT },
            );
            postTasks.unshift({ title: 'Run scaffold GT.', task: runScaffoldGT });
        } else {
            preTasks.push({ title: 'Prepare for copy project files.', task: prepareForCopyProjectFiles });
        }

        const preListr = new Listr(preTasks);
        const postListr = new Listr(postTasks);

        listrContext = await preListr.run(listrContext);
        if (listrContext.GTInfo) {
            listrContext.GTInfo.config = {};
        }

        if (listrContext.projectGT && listrContext.projectGT.ask) {
            listrContext.GTInfo.config = await listrContext.projectGT.ask(listrContext.GTInfo);
        }

        listrContext = await postListr.run(listrContext);

        if (listrContext.projectGT && listrContext.projectGT.after) {
            await listrContext.projectGT.after(listrContext.GTInfo);
        }
    } catch (ex) {
        if (ex.message === 'spawn yarn ENOENT') {
            console.error(`Please install \`yarn\`.
See [docs](https://yarnpkg.com/en/docs/install) for details.`);
            return console.log(ex);
        }
        console.log(ex);
    }
};
