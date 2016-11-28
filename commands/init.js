/**
 * @since 2016-11-16 10:20
 * @author vivaxy
 */

import path from 'path';
import sh from 'shelljs';
import inquirer from 'inquirer';

import fileExists from '../lib/fileExists';
import * as configUtil from '../lib/configUtil';
import updateScaffoldStat from '../lib/updateScaffoldStat';
import { GTHome } from '../config';

import getCopyFiles from '../presets/copyFiles';
import getWriteFile from '../presets/writeFile';
import getUpdateFile from '../presets/updateFile';
import getWriteJson from '../presets/writeJson';
import getUpdateJson from '../presets/updateJson';

const projectGTFile = `scripts/gt.js`;

const cwd = process.cwd();

export default async() => {

    const userConfig = configUtil.read();
    const scaffoldConfig = userConfig.scaffold;
    const scaffoldNameList = configUtil.readScaffoldListByStatOrder();

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

    console.log(`using scaffold: ${selectedScaffoldName}`);

    if (!sh.test(`-d`, selectedScaffoldFolder)) {
        console.log(`cloning: ${selectedScaffoldRepo}`);
        const clone = sh.exec(`git clone ${selectedScaffoldRepo} ${selectedScaffoldFolder}`);
        if (clone.code !== 0) {
            console.log(`clone error: ${selectedScaffoldRepo}
${clone.stderr}`);
            sh.exit(1);
        }
    }

    sh.cd(selectedScaffoldFolder);
    console.log(`git pull...`);
    sh.exec(`git pull`);
    console.log(`npm install...`);
    sh.exec(`npm install`);
    sh.cd(cwd);

    const projectGTFilePath = path.join(GTHome, selectedScaffoldName, projectGTFile);

    const projectGTFileExists = await fileExists(projectGTFilePath);
    if (projectGTFileExists) {
        try {
            const projectGT = require(projectGTFilePath);
            let projectGit = null;
            try {
                const result = sh.exec(`git remote get-url origin`, {
                    silent: true,
                });
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

            await projectGT.init(GTInfo);

            updateScaffoldStat(selectedScaffoldName);

        } catch (ex) {
            console.log(ex);
        }
    } else {
        console.log(`no gt script found in ${selectedScaffoldName}`);
    }
}
