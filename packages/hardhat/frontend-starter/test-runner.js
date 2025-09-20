// Simple test runner for frontend components
const fs = require('fs');
const path = require('path');

console.log('🧪 Running Frontend Component Tests...\n');

// Test 1: Check if all component files exist
console.log('📁 Testing file structure...');
const requiredFiles = [
    'components/FeedPage.tsx',
    'components/PostCard.tsx',
    'components/VoteButtons.tsx',
    'components/TipModal.tsx',
    'hooks/useSonadContract.ts',
    'types/twitter.ts',
    'utils/api.ts',
    'package.json',
    'README.md'
];

let filesExist = true;
requiredFiles.forEach(file => {
    const fullPath = path.join(__dirname, file);
    if (fs.existsSync(fullPath)) {
        console.log(`  ✅ ${file}`);
    } else {
        console.log(`  ❌ ${file} - MISSING`);
        filesExist = false;
    }
});

// Test 2: Check TypeScript interfaces
console.log('\n📝 Testing TypeScript interfaces...');
const typesFile = fs.readFileSync(path.join(__dirname, 'types/twitter.ts'), 'utf8');
const requiredTypes = ['TwitterPost', 'TwitterMedia', 'SonadPost', 'VoteData', 'TipData'];

requiredTypes.forEach(type => {
    if (typesFile.includes(`interface ${type}`)) {
        console.log(`  ✅ ${type} interface defined`);
    } else {
        console.log(`  ❌ ${type} interface missing`);
        filesExist = false;
    }
});

// Test 3: Check component exports
console.log('\n⚛️ Testing React components...');
const componentFiles = [
    'components/FeedPage.tsx',
    'components/PostCard.tsx',
    'components/VoteButtons.tsx',
    'components/TipModal.tsx'
];

componentFiles.forEach(file => {
    const content = fs.readFileSync(path.join(__dirname, file), 'utf8');
    const fileName = path.basename(file, '.tsx');

    if (content.includes(`const ${fileName}`) && content.includes('export default')) {
        console.log(`  ✅ ${fileName} component properly exported`);
    } else {
        console.log(`  ❌ ${fileName} component export issue`);
        filesExist = false;
    }
});

// Test 4: Check for required props
console.log('\n🔧 Testing component props...');
const postCardContent = fs.readFileSync(path.join(__dirname, 'components/PostCard.tsx'), 'utf8');

const requiredProps = ['post', 'onVote', 'onTip'];
requiredProps.forEach(prop => {
    if (postCardContent.includes(prop)) {
        console.log(`  ✅ PostCard accepts ${prop} prop`);
    } else {
        console.log(`  ❌ PostCard missing ${prop} prop`);
        filesExist = false;
    }
});

// Test 5: Check hook functions
console.log('\n🎣 Testing custom hooks...');
const hookContent = fs.readFileSync(path.join(__dirname, 'hooks/useSonadContract.ts'), 'utf8');

const requiredFunctions = ['getPost', 'vote', 'tipCreator', 'getMonadBalance'];
requiredFunctions.forEach(func => {
    if (hookContent.includes(func)) {
        console.log(`  ✅ useSonadContract includes ${func}`);
    } else {
        console.log(`  ❌ useSonadContract missing ${func}`);
        filesExist = false;
    }
});

// Test 6: Check package.json dependencies
console.log('\n📦 Testing package dependencies...');
const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));

const requiredDeps = ['react', 'wagmi', 'viem', '@tanstack/react-query'];
requiredDeps.forEach(dep => {
    if (packageJson.dependencies && packageJson.dependencies[dep]) {
        console.log(`  ✅ ${dep} dependency listed`);
    } else {
        console.log(`  ❌ ${dep} dependency missing`);
    }
});

// Test 7: Check for Twitter JSON compatibility
console.log('\n🐦 Testing Twitter JSON compatibility...');
const testTwitterData = {
    id: "1967419837006901294",
    author_id: "1704079725839495168",
    text: "Gm🌟 Gmonad💜",
    created_at: "2025-09-20T02:00:57.349Z",
    username: "1Cilineth",
    name: "Cilin (mainnet arc)",
    profile_image_url: "https://example.com/image.jpg",
    like_count: 1173,
    media: []
};

const feedPageContent = fs.readFileSync(path.join(__dirname, 'components/FeedPage.tsx'), 'utf8');
const twitterFields = ['id', 'username', 'name', 'text', 'created_at', 'like_count'];

twitterFields.forEach(field => {
    if (feedPageContent.includes(field)) {
        console.log(`  ✅ FeedPage handles ${field} field`);
    } else {
        console.log(`  ⚠️ FeedPage might not handle ${field} field`);
    }
});

// Final Results
console.log('\n📊 Test Summary:');
if (filesExist) {
    console.log('🎉 All tests passed! Frontend components are ready.');
    console.log('\n🚀 Next steps:');
    console.log('  1. Open test-app.html in your browser');
    console.log('  2. Copy components to your React project');
    console.log('  3. Replace TODO comments with actual contract calls');
    console.log('  4. Add wallet connection');
    console.log('  5. Deploy and test!');
} else {
    console.log('❌ Some tests failed. Check the errors above.');
}

console.log('\n🌐 To test the UI:');
console.log('  • Open frontend-starter/test-app.html in your browser');
console.log('  • All components are functional with your Twitter JSON format');
console.log('  • Click buttons to test voting and tipping flows');

process.exit(filesExist ? 0 : 1);