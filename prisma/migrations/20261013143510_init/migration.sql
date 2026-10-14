-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'EDITOR',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "token" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SiteSettings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT DEFAULT 1,
    "siteName" TEXT NOT NULL DEFAULT 'Womentor Africa',
    "tagline" TEXT NOT NULL DEFAULT 'Lifting as We Rise',
    "metaTitle" TEXT NOT NULL DEFAULT 'Womentor',
    "metaDescription" TEXT NOT NULL DEFAULT 'For Women by Women',
    "logoUrl" TEXT NOT NULL DEFAULT '/images/logos/womentorIcon.svg',
    "appUrl" TEXT NOT NULL DEFAULT 'https://my.womentorafrica.com',
    "loginLabel" TEXT NOT NULL DEFAULT 'Login',
    "partnershipsEmail" TEXT NOT NULL DEFAULT 'partnerships@womentorafrica.com',
    "infoEmail" TEXT NOT NULL DEFAULT 'info@womentorafrica.com',
    "phone" TEXT NOT NULL DEFAULT '+254 719 286 229',
    "organisationName" TEXT NOT NULL DEFAULT 'African WoMentors Ltd',
    "addressLine1" TEXT NOT NULL DEFAULT '2nd Floor, The AXIS, 26 Bank Street',
    "addressLine2" TEXT NOT NULL DEFAULT 'Cybercity, Ebène 72201',
    "addressCountry" TEXT NOT NULL DEFAULT 'Mauritius',
    "instagramUrl" TEXT NOT NULL DEFAULT 'https://www.instagram.com/womentorafrica/',
    "linkedinUrl" TEXT NOT NULL DEFAULT 'https://www.linkedin.com/company/womentorafrica/',
    "copyrightText" TEXT NOT NULL DEFAULT '© 2025 Womentor Africa | Lifting as We Rise',
    "menteeSignup" BOOLEAN NOT NULL DEFAULT true,
    "menteeWaitlist" BOOLEAN NOT NULL DEFAULT true,
    "mentorSignup" BOOLEAN NOT NULL DEFAULT true,
    "mentorWaitlist" BOOLEAN NOT NULL DEFAULT true,
    "showNews" BOOLEAN NOT NULL DEFAULT true,
    "showEvents" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "HomeContent" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT DEFAULT 1,
    "heroTitle" TEXT NOT NULL DEFAULT 'Lifting as
We Rise',
    "heroSubtitle" TEXT NOT NULL DEFAULT '',
    "heroQuote" TEXT NOT NULL DEFAULT '',
    "heroCtaLabel" TEXT NOT NULL DEFAULT 'Learn more',
    "heroCtaTarget" TEXT NOT NULL DEFAULT 'about',
    "heroImage" TEXT NOT NULL DEFAULT '/images/illustrations/heroImage.svg',
    "aboutTitle" TEXT NOT NULL DEFAULT 'About Womentor Africa',
    "approachTitle" TEXT NOT NULL DEFAULT 'Our Approach',
    "approachIntro" TEXT NOT NULL DEFAULT '',
    "mentorshipTitle" TEXT NOT NULL DEFAULT 'Mentorship Overview',
    "mentorshipBody" TEXT NOT NULL DEFAULT '',
    "mentorshipImage" TEXT NOT NULL DEFAULT '/images/illustrations/womenPicture.svg',
    "featuresTitle" TEXT NOT NULL DEFAULT 'What makes our mentorship program unique:',
    "featuresImage" TEXT NOT NULL DEFAULT '/images/illustrations/womenInsideACircle.svg',
    "expectTitle" TEXT NOT NULL DEFAULT 'What to Expect',
    "expectIntro" TEXT NOT NULL DEFAULT '',
    "expectCtaTitle" TEXT NOT NULL DEFAULT 'Ready to grow, give back, and rise together?',
    "expectCtaBody" TEXT NOT NULL DEFAULT '',
    "quoteText" TEXT NOT NULL DEFAULT '',
    "impactTitle" TEXT NOT NULL DEFAULT 'Our Impact',
    "impactIntro" TEXT NOT NULL DEFAULT '',
    "partnersTitle" TEXT NOT NULL DEFAULT 'Partners',
    "partnersSubtitle" TEXT NOT NULL DEFAULT 'Supported by Visionary Partners',
    "communityTitle" TEXT NOT NULL DEFAULT 'Together, we lift. Together, we rise.',
    "communityBody" TEXT NOT NULL DEFAULT '',
    "communityImage" TEXT NOT NULL DEFAULT '/images/illustrations/womensHoldingHand.svg',
    "partnerTitle" TEXT NOT NULL DEFAULT 'Partner With Us',
    "partnerBody" TEXT NOT NULL DEFAULT '',
    "followTitle" TEXT NOT NULL DEFAULT 'Follow Womentor Africa',
    "followBody" TEXT NOT NULL DEFAULT '',
    "contactTitle" TEXT NOT NULL DEFAULT 'Contact Information',
    "signupWelcome" TEXT NOT NULL DEFAULT 'Welcome to Womentor Africa!',
    "signupPrompt" TEXT NOT NULL DEFAULT 'Select the role you''re interested in',
    "menteeBenefits" TEXT NOT NULL DEFAULT '',
    "mentorBenefits" TEXT NOT NULL DEFAULT '',
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "AboutSlide" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "heading" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "image" TEXT NOT NULL DEFAULT '',
    "order" INTEGER NOT NULL DEFAULT 0,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Pillar" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT NOT NULL DEFAULT '',
    "color" TEXT NOT NULL DEFAULT 'orange',
    "order" INTEGER NOT NULL DEFAULT 0,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Feature" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ExpectTab" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Faq" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Stat" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "value" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "icon" TEXT NOT NULL DEFAULT 'users',
    "order" INTEGER NOT NULL DEFAULT 0,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Partner" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "logo" TEXT NOT NULL,
    "website" TEXT NOT NULL DEFAULT '',
    "order" INTEGER NOT NULL DEFAULT 0,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Post" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "excerpt" TEXT NOT NULL DEFAULT '',
    "body" TEXT NOT NULL DEFAULT '',
    "coverImage" TEXT NOT NULL DEFAULT '',
    "author" TEXT NOT NULL DEFAULT '',
    "publishedAt" DATETIME,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "summary" TEXT NOT NULL DEFAULT '',
    "body" TEXT NOT NULL DEFAULT '',
    "coverImage" TEXT NOT NULL DEFAULT '',
    "location" TEXT NOT NULL DEFAULT 'Online',
    "startsAt" DATETIME NOT NULL,
    "endsAt" DATETIME,
    "registerUrl" TEXT NOT NULL DEFAULT '',
    "published" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Media" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "filename" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "alt" TEXT NOT NULL DEFAULT '',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "WaitlistSubscriber" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "ContactMessage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "subject" TEXT NOT NULL DEFAULT '',
    "message" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Session_token_key" ON "Session"("token");

-- CreateIndex
CREATE UNIQUE INDEX "Post_slug_key" ON "Post"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Event_slug_key" ON "Event"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "WaitlistSubscriber_email_role_key" ON "WaitlistSubscriber"("email", "role");
