const fs = require('fs');
const path = require('path');

const talksData = [
    {
        id: 'talk1',
        title: 'Introduction to WebAssembly',
        speakers: [{ name: 'Alice Johnson' }],
        category: ['Web Development', 'Performance'],
        duration: 60,
        description: 'Explore the fundamentals of WebAssembly and its impact on web performance and new application possibilities.'
    },
    {
        id: 'talk2',
        title: 'Modern CSS Techniques',
        speakers: [{ name: 'Bob Williams' }],
        category: ['Frontend', 'CSS', 'Design'],
        duration: 60,
        description: 'Dive into the latest CSS features like Grid, Flexbox, and custom properties for building stunning UIs.'
    },
    {
        id: 'talk3',
        title: 'Serverless Architectures with Node.js',
        speakers: [{ name: 'Charlie Brown' }, { name: 'Diana Prince' }],
        category: ['Backend', 'Cloud', 'Node.js'],
        duration: 60,
        description: 'Learn how to build scalable and cost-effective serverless applications using Node.js functions in the cloud.'
    },
    {
        id: 'talk4',
        title: 'Deep Learning with TensorFlow.js',
        speakers: [{ name: 'Eve Adams' }],
        category: ['AI/ML', 'JavaScript'],
        duration: 60,
        description: 'Discover how to implement and deploy deep learning models directly in the browser with TensorFlow.js.'
    },
    {
        id: 'talk5',
        title: 'Containerization with Docker',
        speakers: [{ name: 'Frank White' }],
        category: ['DevOps', 'Containers'],
        duration: 60,
        description: 'An essential guide to Docker for developers, covering image creation, container management, and orchestration basics.'
    },
    {
        id: 'talk6',
        title: 'Securing Your Web Applications',
        speakers: [{ name: 'Grace Hopper' }, { name: 'Harry Potter' }],
        category: ['Security', 'Web Development'],
        duration: 60,
        description: 'Best practices and common pitfalls in securing modern web applications against various threats.'
    }
];

const htmlTemplatePath = path.join(process.cwd(), 'index.html.template');
const cssPath = path.join(process.cwd(), 'style.css');
const jsPath = path.join(process.cwd(), 'script.js');
const outputPath = path.join(process.cwd(), 'index.html');

try {
    let htmlContent = fs.readFileSync(htmlTemplatePath, 'utf8');
    const cssContent = fs.readFileSync(cssPath, 'utf8');
    let jsContent = fs.readFileSync(jsPath, 'utf8');

    // Inject talks data into script
    jsContent = jsContent.replace(
        'const talksData = []; // This will be populated by generate_website.js',
        `const talksData = ${JSON.stringify(talksData, null, 2)};`
    );

    // Inject CSS and JS into the HTML template
    htmlContent = htmlContent.replace('<style id="inlined-css"></style>', `<style>${cssContent}</style>`);
    htmlContent = htmlContent.replace('<script id="inlined-script"></script>', `<script>${jsContent}</script>`);

    fs.writeFileSync(outputPath, htmlContent, 'utf8');
    console.log(`Successfully generated ${outputPath}`);

} catch (error) {
    console.error('Error generating website:', error);
}
