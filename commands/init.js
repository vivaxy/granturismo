/**
 * @since 2016-11-16 10:20
 * @author vivaxy
 */

import path from 'path';
import sh from 'shelljs';
import inquirer from 'inquirer';

import ensureConfig from '../lib/ensureConfig';
import { GTHome } from '../config';

import getCopyFiles from '../presets/copyFiles';
import getWriteFile from '../presets/writeFile';
import getUpdateFile from '../presets/updateFile';
import getWriteJson from '../presets/writeJson';
import getUpdateJson from '../presets/updateJson';

const projectGTFile = `scripts/gt.js`;

const cwd = process.cwd();

export default async() => {

    ensureConfig();

    const userConfig = require(path.join(GTHome, `config.json`));
    const scaffoldConfig = userConfig.scaffold;
    const scaffoldNameList = Object.keys(scaffoldConfig);

    const answer = await inquirer.prompt([
        {
            type: `list`,
            name: `scaffold`,
            message: `choose scaffold...`,
            choices: scaffoldNameList,
            filter: function(val) {
                return val.toLowerCase();
            }
        }
    ]);

    const selectedScaffoldName = answer.scaffold;
    const selectedScaffoldNameRepoURL = scaffoldConfig[selectedScaffoldName];
    const selectedScaffoldFolder = path.join(GTHome, selectedScaffoldName);

    console.log(`using scaffold: ${selectedScaffoldName}`);

    if (!sh.test(`-d`, selectedScaffoldFolder)) {
        console.log(`cloning: selectedScaffoldNameRepoURL`);
        const clone = sh.exec(`git clone ${selectedScaffoldNameRepoURL} ${selectedScaffoldFolder}`);
        if (clone.code !== 0) {
            console.log(`clone error: ${selectedScaffoldNameRepoURL}
${clone.stderr}`);
            sh.exit(1);
        }
    }

    sh.cd(selectedScaffoldFolder);
    console.log(`git pull`);
    sh.exec(`git pull`);
    console.log(`npm install`);
    sh.exec(`npm install`);
    sh.cd(cwd);

    const projectGTFilePath = path.join(GTHome, selectedScaffoldName, projectGTFile);
    try {
        const projectGT = require(projectGTFilePath);
        let projectGit = null;
        try {
            const result = sh.exec(`git remote get-url origin`);
            if (result.code === 0) {
                const repositoryURL = result.stdout.split(`\n`)[0];
                projectGit = {
                    repositoryURL,
                };
            }
        } catch (ex) {
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

        projectGT.init(GTInfo);
    } catch (ex) {
        console.log(ex);
        console.log(`no gt script found in ${selectedScaffoldName}`);
    }

}
