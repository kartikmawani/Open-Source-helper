import axios from 'axios';
import Data from '../Models/user.data.model.js';
import User from '../Models/user.models.js';
export const fileScanner = async (githubId) => {
    try {
        const user = await User.findOne({ githubId });
        if (!user) {
            throw new Error(`User with GitHub ID ${githubId} not found.`);
        }
        const reqData = await Data.findOne({ userId: user._id });
        if (!reqData || !reqData.repoNames || reqData.repoNames.length === 0) {
            throw new Error("No repository data found for this user.");
        }
        reqData.set('fileNames', []);
        const owner = user.name;
        const accessToken = user.accessToken;
        const repo = reqData.repoNames[0];
        if (!repo) {
            throw new Error("No repo found");
        }
        await dfsCrawler(owner, repo, "", reqData, accessToken);
        await reqData.save();
    }
    catch (err) {
        console.error("Scanner wrapping failed", err);
    }
};
const dfsCrawler = async (owner, repo, path, reqData, accessToken) => {
    //const content=[]
    if (!repo) {
        return;
    }
    try {
        const { data: items } = await axios.get(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'User-Agent': 'OpenSource-Helper',
                'Accept': 'application/vnd.github+json' //It is the  default github Api respose  
            }
        });
        const requiredFile = ["Readme.md", "App.js", "package.json", "App.ts"];
        const IGNORED_ITEMS = ['node_modules', '.git', 'dist', '.env'];
        for (const item of items) {
            if (IGNORED_ITEMS.includes(item.name)) {
                continue;
            }
            if (item.type === 'file') {
                const isRequired = requiredFile.some(req => req.toLowerCase() === item.name.toLowerCase());
                if (isRequired) {
                    reqData.fileNames.push({ name: item.name, path: item.path });
                    console.log(`${item.path}`);
                }
            }
            else if (item.type === 'dir') {
                await dfsCrawler(owner, repo, item.path, reqData, accessToken);
            }
        }
    }
    catch (error) {
        console.error("Unable to perform operation on github files");
    }
};
//# sourceMappingURL=githubFileScanner.js.map