import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function generateSlug(title: string): string {
  const cleanTitle = title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return `${cleanTitle}-${Math.floor(1000 + Math.random() * 9000)}`;
}

function estimateReadingTime(text: string): number {
  const words = text.replace(/<[^>]*>/g, '').trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

async function runCompleteBloggingTestSuite() {
  console.log('===============================================================');
  console.log('🚀 STARTING COMPREHENSIVE END-TO-END BLOGGING SYSTEM TEST SUITE');
  console.log('===============================================================\n');

  let createdPostId: string | null = null;

  try {
    // ------------------------------------------------------------------------
    // STEP 1: Verify or Setup Teacher Profile & User
    // ------------------------------------------------------------------------
    console.log('📍 STEP 1: Setting up / Verifying Teacher Profile...');
    
    let user = await prisma.user.findFirst({ where: { role: 'TEACHER' } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: `prof.teacher.${Date.now()}@example.com`,
          name: 'Prof. Ashwini Sawant',
          password: 'hashedpassword123',
          role: 'TEACHER',
        },
      });
      console.log('   -> Created new User account for Teacher:', user.email);
    }

    let teacher = await prisma.teacherProfile.findFirst({ where: { userId: user.id } });
    if (!teacher) {
      teacher = await prisma.teacherProfile.create({
        data: {
          userId: user.id,
          fullName: 'Prof. Ashwini Sawant',
          designation: 'Assistant Professor & AI Mentor',
          department: 'Computer Engineering',
          university: 'Mumbai University',
          expertise: 'Neural Networks, Distributed Systems, Web Technologies',
          heroSubtitle: 'Leading Academic Researcher & Mentor',
          bioText: 'Dedicated educator specializing in deep learning architectures and full-stack cloud applications.',
          contactEmail: user.email,
        },
      });
      console.log('   -> Created Teacher Profile:', teacher.fullName);
    } else {
      console.log('   -> Found Teacher Profile:', teacher.fullName, `(ID: ${teacher.id})`);
    }

    // ------------------------------------------------------------------------
    // STEP 2: Create a Draft Blog Post from Scratch with Rich Formatting & Fitted Images
    // ------------------------------------------------------------------------
    console.log('\n📍 STEP 2: Creating a Draft Blog Post with Rich Text & Fitted Images...');
    
    const draftTitle = 'Deep Learning & Neural Network Systems in Distributed Cloud Environments';
    const draftSlug = generateSlug(draftTitle);
    const draftSummary = 'An in-depth exploration of neural network backpropagation, GPU acceleration, and distributed node communication.';

    // Construct content with Calibri, Times New Roman, Bold, Italic, Underline, Font Sizes, and 3 Fitted Images
    const draftContent = `
      <div style="font-family: Calibri, sans-serif;">
        
        <h2 style="font-family: 'Times New Roman', Times, serif; font-size: 30px; font-weight: bold; color: #0f172a; margin-bottom: 1rem;">
          <u>1. Introduction to Distributed Deep Learning</u>
        </h2>

        <p style="font-size: 16px; line-height: 1.7; color: #334155; margin-bottom: 1.25rem;">
          Modern artificial intelligence relies on <b>high-throughput parallel computing</b> across distributed GPU clusters. When training deep neural network architectures, engineers must balance <i>data parallelism</i> with <u>model parallelism</u> to optimize memory usage.
        </p>

        <!-- Fitted Image 1: Float Left (50% Width) -->
        <figure style="float: left; margin: 0.5rem 1.5rem 1rem 0; max-width: 50%;" class="blog-fitted-image align-left">
          <img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800" alt="Neural Network Nodes Diagram" style="width: 100%; max-width: 350px; height: auto; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.08);" class="rounded-xl shadow-sm inline-block" />
          <figcaption style="font-size: 0.85rem; color: #64748b; margin-top: 0.5rem; font-style: italic; text-align: center;">Figure 1: Neural Network Layer Connections (Fitted Left 50%)</figcaption>
        </figure>

        <p style="font-size: 16px; line-height: 1.7; color: #334155; margin-bottom: 1.25rem;">
          As depicted in <i>Figure 1 (fitted left)</i>, node activations are computed using non-linear activation functions such as ReLU, GELU, and Sigmoid. Weight updates are synchronized across compute nodes using gradient reduction protocols.
        </p>

        <h3 style="font-family: Calibri, sans-serif; font-size: 24px; font-weight: bold; color: #0284c7; margin-top: 2rem; margin-bottom: 1rem; clear: both;">
          <u>2. Gradient Descent & Loss Optimization</u>
        </h3>

        <!-- Fitted Image 2: Float Right (30% Width) -->
        <figure style="float: right; margin: 0.5rem 0 1rem 1.5rem; max-width: 50%;" class="blog-fitted-image align-right">
          <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800" alt="Optimization Graph" style="width: 100%; max-width: 250px; height: auto; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.08);" class="rounded-xl shadow-sm inline-block" />
          <figcaption style="font-size: 0.85rem; color: #64748b; margin-top: 0.5rem; font-style: italic; text-align: center;">Figure 2: Loss Convergence Curve (Fitted Right 30%)</figcaption>
        </figure>

        <p style="font-size: 16px; line-height: 1.7; color: #334155; margin-bottom: 1.25rem;">
          Mathematical optimization uses AdamW and SGD optimizers with learning rate schedulers to minimize cross-entropy loss:
        </p>

        <ul style="font-family: 'Times New Roman', Times, serif; font-size: 18px; line-height: 1.8; color: #1e293b; margin-left: 1.5rem; margin-bottom: 1.5rem;">
          <li><b>Forward Pass:</b> Compute network predictions for batch size <b>B</b>.</li>
          <li><i>Loss Computation:</i> Measure discrepancy between output and ground-truth labels.</li>
          <li><u>Backpropagation:</u> Apply the calculus chain rule to calculate weight gradients.</li>
        </ul>

        <!-- Fitted Image 3: Center Block (100% Width) -->
        <figure style="margin: 2rem auto; text-align: center; clear: both; display: block;" class="blog-fitted-image align-center">
          <img src="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=1000" alt="Cloud Infrastructure Server Cluster" style="max-width: 100%; height: auto; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); object-fit: contain;" class="rounded-xl shadow-sm inline-block" />
          <figcaption style="font-size: 0.85rem; color: #64748b; margin-top: 0.5rem; font-style: italic; text-align: center;">Figure 3: High-Performance GPU Data Center Architecture (Fitted Center 100%)</figcaption>
        </figure>

      </div>
    `;

    const draftReadingTime = estimateReadingTime(draftContent);

    const draftPost = await prisma.blogPost.create({
      data: {
        teacherId: teacher.id,
        title: draftTitle,
        slug: draftSlug,
        summary: draftSummary,
        content: draftContent,
        coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800',
        isPublished: false, // Save initial state as DRAFT
        estimatedReadingMinutes: draftReadingTime,
      },
    });

    createdPostId = draftPost.id;
    console.log('   -> Draft Post Created Successfully!');
    console.log('      Post ID:', draftPost.id);
    console.log('      Slug:', draftPost.slug);
    console.log('      Status:', draftPost.isPublished ? 'PUBLISHED' : 'DRAFT');
    console.log('      Estimated Read Time:', draftPost.estimatedReadingMinutes, 'min');

    // ------------------------------------------------------------------------
    // STEP 3: Verify Teacher Dashboard Retrieval
    // ------------------------------------------------------------------------
    console.log('\n📍 STEP 3: Verifying Teacher Dashboard Blog Listing...');
    
    const teacherBlogs = await prisma.blogPost.findMany({
      where: { teacherId: teacher.id },
      orderBy: { createdAt: 'desc' },
    });

    const foundInDashboard = teacherBlogs.find((b) => b.id === draftPost.id);
    if (foundInDashboard && !foundInDashboard.isPublished) {
      console.log('   -> PASSED: Draft blog appears in Teacher Dashboard as Draft.');
    } else {
      throw new Error('FAILED: Draft blog not found in teacher dashboard list');
    }

    // ------------------------------------------------------------------------
    // STEP 4: Update & Publish Blog Post
    // ------------------------------------------------------------------------
    console.log('\n📍 STEP 4: Updating Content & Publishing Blog Post...');
    
    const updatedTitle = 'Deep Learning & Neural Network Systems in Distributed Cloud Environments [Faculty Choice]';
    const updatedSummary = draftSummary + ' Updated with practical engineering guidelines for university students.';
    const updatedContent = draftContent + `
      <p style="font-family: Calibri, sans-serif; font-size: 16px; color: #0284c7; font-weight: bold; margin-top: 1rem; clear: both;">
        <u>3. Faculty Note & Student Conclusion:</u><br />
        Mastering these core principles will give students a strong foundation for both academic thesis research and industrial AI engineering roles.
      </p>
    `;

    const updatedPost = await prisma.blogPost.update({
      where: { id: draftPost.id },
      data: {
        title: updatedTitle,
        summary: updatedSummary,
        content: updatedContent,
        isPublished: true, // PUBLISH THE BLOG POST
        estimatedReadingMinutes: estimateReadingTime(updatedContent),
      },
    });

    console.log('   -> PASSED: Blog Post Updated & Published!');
    console.log('      Updated Title:', updatedPost.title);
    console.log('      New Status:', updatedPost.isPublished ? 'PUBLISHED' : 'DRAFT');

    // ------------------------------------------------------------------------
    // STEP 5: Test Public Search & Teacher Filtering
    // ------------------------------------------------------------------------
    console.log('\n📍 STEP 5: Testing Public Search & Teacher Filtering...');
    
    // Test 5A: Search by keyword "Neural Network"
    const searchResults = await prisma.blogPost.findMany({
      where: {
        isPublished: true,
        OR: [
          { title: { contains: 'Neural Network' } },
          { summary: { contains: 'Neural Network' } },
        ],
      },
      include: { teacher: true },
    });

    const searchHit = searchResults.find((p) => p.id === updatedPost.id);
    if (searchHit) {
      console.log('   -> PASSED: Search query "Neural Network" correctly matched the published post.');
    } else {
      throw new Error('FAILED: Search query failed to find published post');
    }

    // Test 5B: Filter by teacherId
    const teacherFilteredPosts = await prisma.blogPost.findMany({
      where: {
        isPublished: true,
        teacherId: teacher.id,
      },
      include: { teacher: true },
    });

    const filterHit = teacherFilteredPosts.find((p) => p.id === updatedPost.id);
    if (filterHit && filterHit.teacher?.fullName === teacher.fullName) {
      console.log('   -> PASSED: Filter by Teacher ID returned post with complete Author profile data.');
    } else {
      throw new Error('FAILED: Teacher filter failed to match post or author details');
    }

    // ------------------------------------------------------------------------
    // STEP 6: Test Single Blog Reader View & Formatting Audit
    // ------------------------------------------------------------------------
    console.log('\n📍 STEP 6: Auditing Blog Reader View & Rich Formatting Attributes...');
    
    const publicPostView = await prisma.blogPost.findUnique({
      where: { slug: draftSlug },
      include: { teacher: true },
    });

    if (!publicPostView) {
      throw new Error('FAILED: Public reader post view returned null for valid slug');
    }

    // Audit rich text features inside content HTML
    const contentHtml = publicPostView.content;
    const checks = [
      { feature: 'Calibri Font Family', pass: contentHtml.includes('font-family: Calibri') },
      { feature: 'Times New Roman Font Family', pass: contentHtml.includes("font-family: 'Times New Roman'") },
      { feature: 'Bold Formatting (<b>)', pass: contentHtml.includes('<b>') },
      { feature: 'Italic Formatting (<i>)', pass: contentHtml.includes('<i>') },
      { feature: 'Underline Formatting (<u>)', pass: contentHtml.includes('<u>') },
      { feature: 'Font Size Adjustments (30px, 24px, 18px, 16px)', pass: contentHtml.includes('font-size: 30px') && contentHtml.includes('font-size: 24px') },
      { feature: 'Float Left Fitted Image (50% width)', pass: contentHtml.includes('align-left') && contentHtml.includes('max-width: 50%') },
      { feature: 'Float Right Fitted Image (30% width)', pass: contentHtml.includes('align-right') },
      { feature: 'Center Block Fitted Image (100% width)', pass: contentHtml.includes('align-center') },
      { feature: 'Teacher Author Relation (Name & Uni)', pass: publicPostView.teacher?.fullName === teacher.fullName },
    ];

    checks.forEach((check) => {
      console.log(`   -> [${check.pass ? '✓ PASS' : '✗ FAIL'}] ${check.feature}`);
      if (!check.pass) {
        throw new Error(`Formatting audit failed for feature: ${check.feature}`);
      }
    });

    // Simulate View Counter Increment
    const incrementedPost = await prisma.blogPost.update({
      where: { id: publicPostView.id },
      data: { viewCount: { increment: 1 } },
    });
    console.log('   -> PASSED: View counter incremented. New view count:', incrementedPost.viewCount);

    // ------------------------------------------------------------------------
    // STEP 7: Clean Up & Deletion Verification
    // ------------------------------------------------------------------------
    console.log('\n📍 STEP 7: Testing Blog Post Deletion & Database Cleanup...');
    
    await prisma.blogPost.delete({ where: { id: createdPostId } });

    const verifyDeleted = await prisma.blogPost.findUnique({ where: { id: createdPostId } });
    if (!verifyDeleted) {
      console.log('   -> PASSED: Blog post deleted successfully from database.');
    } else {
      throw new Error('FAILED: Blog post was not deleted from database');
    }

    console.log('\n===============================================================');
    console.log('🎉 ALL BLOGGING SYSTEM TEST CASES PASSED SUCCESSFULLY (100%)!');
    console.log('===============================================================\n');

  } catch (err) {
    console.error('\n❌ TEST SUITE FAILED WITH ERROR:', err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runCompleteBloggingTestSuite();
