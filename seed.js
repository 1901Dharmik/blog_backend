/**
 * seed.js  –  Populates the DB with realistic dummy data
 * Run:  node seed.js
 */

import mongoose from "mongoose";
import dotenv from "dotenv";
import Author from "./models/authorModel.js";
import Blog from "./models/blogModel.js";
import Comment from "./models/commentModel.js";

dotenv.config();

const slugify = (str) =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

const d = (daysAgo) => new Date(Date.now() - daysAgo * 86_400_000);

// ─── Authors (first 4 = article authors, last 3 = tour guides) ───────────────
const AUTHORS = [
  {
    name: "Alex Carter",
    avatarUrl: "https://randomuser.me/api/portraits/men/32.jpg",
    bio: "With over a decade of experience in the fitness industry, Alex specialises in strength training and functional fitness.",
  },
  {
    name: "Maya Liu",
    avatarUrl: "https://randomuser.me/api/portraits/women/44.jpg",
    bio: "Nutrition coach and wellness writer. Maya helps readers build sustainable habits through science-backed meal planning.",
  },
  {
    name: "Jordan Smith",
    avatarUrl: "https://randomuser.me/api/portraits/men/54.jpg",
    bio: "Personal trainer and outdoor adventure enthusiast. Jordan believes every workout should feel like play.",
  },
  {
    name: "Emma Rodriguez",
    avatarUrl: "https://randomuser.me/api/portraits/women/31.jpg",
    bio: "Certified strength coach with a passion for helping beginners feel confident in the gym.",
  },
  // Tour Guides
  {
    name: "Priyanka Raut",
    avatarUrl: "https://randomuser.me/api/portraits/women/65.jpg",
    bio: "Expert guide specialising in cultural heritage tours across South Asia.",
    location: "Mumbai, India",
    rating: 4.8,
  },
  {
    name: "Daniel Marsh",
    avatarUrl: "https://randomuser.me/api/portraits/men/41.jpg",
    bio: "Adventure guide for mountain treks and wilderness expeditions.",
    location: "Vancouver, Canada",
    rating: 4.6,
  },
  {
    name: "Craig Stannis",
    avatarUrl: "https://randomuser.me/api/portraits/men/22.jpg",
    bio: "Local expert for coastal and rainforest eco-tours.",
    location: "Sydney, Aus.",
    rating: 4.2,
  },
];

const BLOG_CONTENT = `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim.</p>

<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes.</p>

<blockquote>With over a decade of experience in the fitness industry, Alex specialises in strength training and functional fitness. Certified by NASM and known for his no-nonsense style, Alex designs workout programs that are both challenging and achievable. His passion lies in helping clients build strength and confidence through evidence-based training routines. Outside the gym, Alex is an avid runner and enjoys outdoor adventures.</blockquote>

<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis.</p>

<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes.</p>

<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem.</p>`;

// ─── Blogs ───────────────────────────────────────────────────────────────────
const BLOGS_SEED = [
  {
    title: "The Ultimate Guide to Full-Body Workouts",
    authorName: "Alex Carter",
    category: "Fitness",
    excerpt:
      "Discover workouts that target every muscle group, for anyone who wants to build strength and endurance. Perfect for beginners and seasoned gym-goers alike.",
    mainImageUrl:
      "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=1200&q=80",
    publishedDate: d(10),
    usefulnessRatings: { heart: 12, thumbsUp: 25, lightbulb: 8, plus: 5 },
  },
  {
    title: "5 Tips For Better Cardio Sessions",
    authorName: "Jordan Smith",
    category: "Fitness",
    excerpt:
      "Improve your cardio performance with these simple adjustments. The key is finding the right balance for your body.",
    mainImageUrl:
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80",
    publishedDate: d(15),
    usefulnessRatings: { heart: 8, thumbsUp: 14, lightbulb: 6, plus: 3 },
  },
  {
    title: "Meal Prep Basics For Gym Enthusiasm",
    authorName: "Maya Liu",
    category: "Nutrition",
    excerpt:
      "Fuel your workouts with smart meal prep. A guide on planning simple meals and staying ready through the whole week.",
    mainImageUrl:
      "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80",
    publishedDate: d(20),
    usefulnessRatings: { heart: 19, thumbsUp: 30, lightbulb: 12, plus: 7 },
  },
  {
    title: "Building Core Strength: Exercises And Benefits",
    authorName: "Emma Rodriguez",
    category: "Fitness",
    excerpt:
      "A strong core is essential for everything you do. Here are the best exercises to build and maintain strong core muscles.",
    mainImageUrl:
      "https://images.unsplash.com/photo-1534258936925-c58bed479fcb?w=800&q=80",
    publishedDate: d(25),
    usefulnessRatings: { heart: 10, thumbsUp: 18, lightbulb: 9, plus: 4 },
  },
  // Explore-sidebar articles
  {
    title: "Two Women In A Local Stand Chatting During Morning Fog",
    authorName: "Maya Liu",
    category: "Culture",
    excerpt:
      "A quiet morning at the local market reveals the warmth of everyday human connection in mountain towns.",
    mainImageUrl:
      "https://images.unsplash.com/photo-1504439904031-93ded9f93e4e?w=600&q=80",
    publishedDate: d(5),
    usefulnessRatings: { heart: 5, thumbsUp: 9, lightbulb: 3, plus: 1 },
  },
  {
    title: "Hiking The Trail On A Pulao Island To See The View Together",
    authorName: "Jordan Smith",
    category: "Travel",
    excerpt:
      "The sunrise from the ridge made every steep step worth it. A guided trek journal from Pulao island.",
    mainImageUrl:
      "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&q=80",
    publishedDate: d(7),
    usefulnessRatings: { heart: 14, thumbsUp: 21, lightbulb: 7, plus: 2 },
  },
  {
    title: "This Look Gives Surroundings Of The Campground As Details Create",
    authorName: "Alex Carter",
    category: "Travel",
    excerpt:
      "Setting up camp with a mountain backdrop – the details of the campground tell their own story.",
    mainImageUrl:
      "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=600&q=80",
    publishedDate: d(12),
    usefulnessRatings: { heart: 7, thumbsUp: 11, lightbulb: 4, plus: 2 },
  },
];

// ─── Comments ────────────────────────────────────────────────────────────────
const COMMENTS_SEED = [
  {
    commenterName: "Randy Pierre",
    commenterEmail: "randy.pierre@example.com",
    commenterAvatarUrl: "https://randomuser.me/api/portraits/men/11.jpg",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient. Cur...",
    rating: 4,
  },
  {
    commenterName: "Kiera Irene",
    commenterEmail: "kiera.irene@example.com",
    commenterAvatarUrl: "https://randomuser.me/api/portraits/women/22.jpg",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Aenean commodo ligula eget dolor. Cur...",
    rating: 5,
  },
];

// ─── Main ─────────────────────────────────────────────────────────────────────
async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅  Connected to MongoDB");

    await Promise.all([
      Author.deleteMany({}),
      Blog.deleteMany({}),
      Comment.deleteMany({}),
    ]);
    console.log("🗑️  Cleared existing data");

    const authors = await Author.insertMany(AUTHORS);
    console.log(`👤  Inserted ${authors.length} authors`);

    const authorMap = Object.fromEntries(authors.map((a) => [a.name, a._id]));

    const blogDocs = BLOGS_SEED.map((b) => {
      const { authorName, ...rest } = b;
      return {
        ...rest,
        slug: slugify(b.title),
        author: authorMap[authorName],
        content: BLOG_CONTENT,
        isPublished: true,
      };
    });

    const blogs = await Blog.insertMany(blogDocs);
    console.log(`📝  Inserted ${blogs.length} blogs`);

    const mainBlog = blogs[0];
    const commentDocs = COMMENTS_SEED.map((c) => ({ ...c, blog: mainBlog._id }));
    await Comment.insertMany(commentDocs);
    console.log(`💬  Inserted ${commentDocs.length} comments on "${mainBlog.title}"`);

    console.log("\n🎉  Seed complete!");
    console.log(`\n   Main article ID  : ${mainBlog._id}`);
    console.log(`   Main article slug : ${mainBlog.slug}`);
    console.log(`\n   Open: http://localhost:3000/blog/${mainBlog.slug}`);
  } catch (err) {
    console.error("❌  Seed failed:", err.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seed();
