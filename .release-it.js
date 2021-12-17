module.exports = {
    git: {
        commitMessage: '${version}',
        requireCleanWorkingDir: false,
        requireUpstream: false,
        tagName: 'v${version}',
    },
    github: {
        release: true,
        releaseName: '${version}',
        releaseNotes: null,
    },
    hooks: {
        'before:init': ['npm test', 'npm run test:e2e'],
        'after:bump': 'npm run build && npm run banner',
        'after:release':
            'echo Successfully released ${name} v${version} to ${repo.repository}.',
    },
};
