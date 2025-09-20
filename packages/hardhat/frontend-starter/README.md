# 🚀 Sonad Frontend Starter

Quick starter kit for building the Sonad frontend with Twitter feed integration and Web3 functionality.

## 📁 **Project Structure**

```
frontend-starter/
├── components/
│   ├── FeedPage.tsx       # Main feed page component
│   ├── PostCard.tsx       # Individual post card
│   ├── VoteButtons.tsx    # Lit/Shit voting buttons
│   └── TipModal.tsx       # Tip creator modal form
├── hooks/
│   └── useSonadContract.ts # Contract interaction hooks
├── types/
│   └── twitter.ts         # TypeScript interfaces
├── utils/
│   └── api.ts            # API utilities
└── README.md             # This file
```

## ⚡ **Quick Setup**

### 1. **Install Dependencies**
```bash
npm install react react-dom @types/react @types/react-dom
npm install wagmi viem @tanstack/react-query
npm install tailwindcss @tailwindcss/forms
```

### 2. **Copy Components**
```bash
# Copy all components to your React project
cp -r frontend-starter/components/* src/components/
cp -r frontend-starter/hooks/* src/hooks/
cp -r frontend-starter/types/* src/types/
cp -r frontend-starter/utils/* src/utils/
```

### 3. **Use Feed Page**
```tsx
import FeedPage from './components/FeedPage';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <FeedPage />
    </div>
  );
}
```

## 🎯 **Key Features**

### **📱 Feed Page (`FeedPage.tsx`)**
- Displays Twitter posts with $MONAD/#NAD hashtags
- Shows blockchain data (votes, tips) when available
- Real-time stats dashboard
- Infinite scroll ready

### **🃏 Post Card (`PostCard.tsx`)**
- Beautiful Twitter-like design
- Shows original Twitter metrics
- Displays blockchain engagement
- Voting and tipping integration

### **🗳️ Voting (`VoteButtons.tsx`)**
- Lit 🔥 / Shit 💩 buttons
- Disabled state for unverified posts
- Loading states and visual feedback
- Prevents double voting

### **💰 Tipping (`TipModal.tsx`)**
- Preset amounts (0.001, 0.01, 0.1, 0.5 ETH)
- Custom amount input
- Fee breakdown (90% creator, 10% platform)
- Wallet integration ready

## 🔧 **Integration Steps**

### **Step 1: Replace Mock Data**
In `FeedPage.tsx`, replace the sample data:

```tsx
// Replace this mock data
const sampleTwitterData = [...];

// With your actual API call
const twitterPosts = await SonadAPI.fetchTwitterPosts();
```

### **Step 2: Connect Smart Contracts**
In `useSonadContract.ts`, uncomment and replace TODO sections:

```tsx
// Replace TODO comments with actual wagmi calls
const { data: post } = useContractRead({
  address: SONAD_CONTRACT_ADDRESS,
  abi: SonadAbi,
  functionName: 'getPost',
  args: [postId]
});
```

### **Step 3: Add Wallet Connection**
Add wallet connection wrapper:

```tsx
import { WagmiConfig } from 'wagmi';
import { config } from './wagmi-config';

function App() {
  return (
    <WagmiConfig config={config}>
      <FeedPage />
    </WagmiConfig>
  );
}
```

## 📡 **API Integration**

### **Your Backend Endpoints**
Update `utils/api.ts` with your actual endpoints:

```typescript
// Replace these URLs with your backend
static BASE_URL = 'https://your-api.com';

// Endpoints needed:
// GET /api/posts - Fetch Twitter posts
// POST /api/verify - Submit for verification
// GET /api/analytics/:tweetId - Get post analytics
```

### **Twitter Data Format**
The components expect this JSON format:
```json
{
  "id": "1967419837006901294",
  "author_id": "1704079725839495168",
  "text": "Gm🌟 Gmonad💜\n\nSay it back🪻",
  "created_at": "2025-09-20T02:00:57.349Z",
  "username": "1Cilineth",
  "name": "Cilin (mainnet arc)",
  "profile_image_url": "https://...",
  "like_count": 1173,
  "retweet_count": 24,
  "media": [...]
}
```

## 🎨 **Styling**

### **Tailwind CSS Classes Used**
- `bg-gradient-to-r from-purple-500 to-blue-500` - Sonad brand gradient
- `text-purple-500` - Primary brand color
- `rounded-xl` - Modern rounded corners
- `shadow-sm hover:shadow-md` - Subtle shadows

### **Custom Colors**
```css
/* Add to your Tailwind config */
colors: {
  sonad: {
    purple: '#8B5CF6',
    blue: '#3B82F6'
  }
}
```

## 🚀 **Deployment Ready Features**

### **✅ What's Included**
- [x] Responsive design (mobile-first)
- [x] Loading states and error handling
- [x] Optimistic UI updates
- [x] TypeScript types for safety
- [x] Modular component structure
- [x] Wallet integration hooks ready
- [x] Event handling for blockchain

### **⚠️ What You Need to Add**
- [ ] Actual Twitter API integration
- [ ] Wallet connection UI
- [ ] User authentication
- [ ] Error boundary components
- [ ] Performance optimizations
- [ ] SEO meta tags

## 🔗 **Integration with Smart Contracts**

### **Import Contract ABIs**
```tsx
import { SonadAbi } from '../contract-deployment/Sonad-parseAbi';
import { CONTRACT_ADDRESSES } from '../contract-deployment/contract-types';
```

### **Use Contract Hooks**
```tsx
const { vote, tipCreator, isLoading } = useSonadContract();

// Vote on post
await vote(BigInt(postId), true); // true = Lit, false = Shit

// Tip creator
await tipCreator(BigInt(postId), '0.1'); // 0.1 ETH
```

## 📱 **Mobile Responsive**

All components are mobile-first responsive:
- Grid layouts adapt to screen size
- Touch-friendly button sizes
- Modal overlays work on mobile
- Optimized for mobile scrolling

## 🧪 **Testing**

### **Component Testing**
```tsx
import { render, screen } from '@testing-library/react';
import PostCard from './PostCard';

test('renders post content', () => {
  render(<PostCard post={mockPost} onVote={jest.fn()} onTip={jest.fn()} />);
  expect(screen.getByText('Gm🌟 Gmonad💜')).toBeInTheDocument();
});
```

## 🚨 **Important Notes**

1. **Replace all TODO comments** with actual implementation
2. **Test with real Monad testnet** before mainnet
3. **Add error boundaries** for production
4. **Implement proper loading states** for better UX
5. **Add analytics tracking** for user engagement

## 🔥 **Performance Tips**

- Use `React.memo()` for PostCard components
- Implement virtual scrolling for large feeds
- Cache API responses with React Query
- Lazy load images and media
- Debounce search and filter inputs

## 🎯 **Next Steps**

1. **Copy components** to your React project
2. **Replace mock data** with real APIs
3. **Connect wallet** and test contracts
4. **Style** with your brand colors
5. **Deploy** and share with users!

---

**Ready to build the future of SocialFi? Let's go! 🚀**