import { siteConfig } from './site';

export const aboutConfig = {
  mission: {
    title: "Our Mission",
    description: `At ${siteConfig.name}, our mission is to empower creators and forward-thinking businesses with the tools they need to build faster and scale better. We believe in providing actionable strategies, expert insights, and comprehensive guides.`
  },
  values: {
    title: "Our Values",
    items: [
      {
        title: "Innovation",
        description: "We constantly strive to push boundaries and explore new ideas to stay ahead of the curve."
      },
      {
        title: "Quality",
        description: "We are committed to delivering the highest quality content and resources to our community."
      },
      {
        title: "Community",
        description: "We believe in fostering a supportive and collaborative community where everyone can thrive."
      },
      {
        title: "Integrity",
        description: "We operate with transparency and honesty in everything we do."
      }
    ]
  },
  team: {
    title: "Meet the Team",
    members: [
      {
        name: "Jane Doe",
        role: "Founder & CEO",
        bio: "Jane has over 10 years of experience in the tech industry and is passionate about helping businesses grow.",
        imageUrl: "/dummy.jpg"
      },
      {
        name: "John Smith",
        role: "Head of Content",
        bio: "John is a seasoned writer and editor who oversees all the content published on our platform.",
        imageUrl: "/dummy.jpg"
      },
      {
        name: "Alice Johnson",
        role: "Lead Developer",
        bio: "Alice is an expert developer who ensures our platform runs smoothly and efficiently.",
        imageUrl: "/dummy.jpg"
      }
    ]
  }
};
