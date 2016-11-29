/**
 * @since 2016-11-16 10:20
 * @author vivaxy
 */

import path from 'path';
import execa from 'execa';
import Listr from 'listr';
import inquirer from 'inquirer';

import fileExists from '../file/fileExists';
import directoryExists from '../file/directoryExists';
import * as configManager from '../lib/configManager';
import updateScaffoldStat from '../lib/updateScaffoldStat';
import checkGitRepository from '../git/checkGitRepository'
import getGitRemote from '../git/getRemote';
import getInfoFromShell from '../lib/getInfoFromShell';
import { GTHome } from '../config';

import getCopyFiles from '../presets/copyFiles';
import getWriteFile from '../presets/writeFile';
import getUpdateFile from '../presets/updateFile';
import getWriteJson from '../presets/writeJson';
import getUpdateJson from '../presets/updateJson';

const projectGTFile = `scripts/gt.js`;

const cwd = process.cwd();

const gitCloneTask = async({selectedScaffoldRepo, selectedScaffoldFolder}) => {
    const clone = await execa(`git`, [`clone`, selectedScaffoldRepo, selectedScaffoldFolder]);
    if (clone.code !== 0) {
        throw new Error(`clone error: ${selectedScaffoldRepo}
${clone.stderr}`);
    }
};

const gitPullTask = async({selectedScaffoldFolder}) => {
    process.chdir(selectedScaffoldFolder);
    await execa(`git`, [`pull`]);
};

const npmInstallTask = async() => {
    await execa(`npm`, [`install`]);
    process.chdir(cwd);
};

const prepareForScaffoldGT = async(ctx) => {

    const {selectedScaffoldName, selectedScaffoldFolder} = ctx;

    const projectGTFilePath = path.join(GTHome, selectedScaffoldName, projectGTFile);
    const projectGTFileExists = await fileExists(projectGTFilePath);

    if (projectGTFileExists) {
        const projectGT = require(projectGTFilePath);
        let projectGit = null;

        const isGitRepository = await checkGitRepository();
        if (isGitRepository) {
            const remote = await getGitRemote();
            const repositoryURL = await getInfoFromShell(`git`, [`remote`, `get-url`, remote]);
            projectGit = {
                repositoryURL,
            };
        }

        const GTInfo = {
            project: {
                folder: cwd,
                name: cwd.split(path.sep).pop(),
                git: projectGit,
            },
            scaffold: {
                folder: selectedScaffoldFolder,
                name: selectedScaffoldName,
            },
        };

        GTInfo.presets = {
            copyFiles: getCopyFiles(GTInfo),
            writeFile: getWriteFile(GTInfo),
            updateFile: getUpdateFile(GTInfo),
            writeJson: getWriteJson(GTInfo),
            updateJson: getUpdateJson(GTInfo),
        };

        ctx.projectGT = projectGT;
        ctx.GTInfo = GTInfo;

    } else {
        throw new Error(`no gt script found in ${selectedScaffoldName}`);
    }
};

const runScaffoldGT = async({projectGT, GTInfo}) => {
    return await projectGT.init(GTInfo);
};

const updateStat = async({selectedScaffoldName}) => {
    await updateScaffoldStat(selectedScaffoldName);
};

export const command = `init`;
export const describe = `Choose a scaffold to init your new project`;
export const builder = {};
export const handler = async() => {

    const userConfig = configManager.read();
    const scaffoldConfig = userConfig.scaffold;
    const scaffoldNameList = configManager.readScaffoldListByStatOrder();

    const answer = await inquirer.prompt([
        {
            type: `list`,
            name: `scaffold`,
            message: `choose scaffold...`,
            choices: scaffoldNameList,
        }
    ]);

    const selectedScaffoldName = answer.scaffold;
    const selectedScaffoldRepo = scaffoldConfig[selectedScaffoldName].repo;
    const selectedScaffoldFolder = path.join(GTHome, selectedScaffoldName);

    const tasks = [
        {
            title: `clone scaffold`,
            task: gitCloneTask,
            skip: async() => {
                const selectedScaffoldFolderExists = await directoryExists(selectedScaffoldFolder);
                if (selectedScaffoldFolderExists) {
                    return `scaffold exists`;
                }
            },
        },
        {
            title: `pull scaffold`,
            task: gitPullTask,
        },
        {
            title: `install scaffold npm packages`,
            task: npmInstallTask,
        },
        {
            title: `prepare for scaffold GT`,
            task: prepareForScaffoldGT,
        },
        {
            title: `run scaffold GT`,
            task: runScaffoldGT,
        },
        {
            title: `finish up`,
            task: updateStat,
        },
    ];

    const listr = new Listr(tasks);

    try {
        const {projectGT} = await listr.run({
            selectedScaffoldName,
            selectedScaffoldRepo,
            selectedScaffoldFolder,
        });
        if (projectGT.after) {
            await projectGT.after();
        }
    } catch (ex) {
        console.error(ex);
    }

};
