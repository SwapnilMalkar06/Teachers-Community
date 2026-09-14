import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function runBloggingSystemTest() {
  console.log('--- STARTING BLOGGING SYSTEM END-TO-END TEST ---');

  try {
    let teacher = await prisma.teacherProfile.findFirst();
    if (!teacher) {
      teacher = await prisma.teacherProfile.create({
        data: {
          fullName: 'Prof. Ashwini Sawant',
          designation: 'Assistant Professor & Tech Mentor',
          department: 'Computer Engineering',
          university: 'Mumbai University',
          expertise: 'Web Technologies, Cloud Computing, Algorithms',
          heroSubtitle: 'Dedicated Educator & Researcher',
          bioText: 'Expert in modern web architecture and computer engineering.',
          contactEmail: 'ashwini.sawant@example.com',
        },
      });
      console.log('Created new test Teacher Profile:', teacher.id);
    } else {
      console.log('Using existing Teacher Profile:', teacher.fullName, `(${teacher.id})`);
    }

    const sampleTitle = 'Comprehensive Guide to Cloud Microservices & Algorithm Performance';
    const sampleSlug = `cloud-microservices-guide-${Date.now()}`;
    const sampleSummary = 'A detailed academic paper and guide covering microservice architecture, algorithm optimization, fitted diagrams, and student study tips.';

    const sampleContent = `
      <div style="font-family: Calibri, sans-serif;">
        
        <h2 style="font-family: 'Times New Roman', Times, serif; font-size: 30px; font-weight: bold; color: #0f172a; margin-bottom: 1rem;">
          <u>1. Introduction to Scalable Systems & Algorithms</u>
        </h2>

        <p style="font-size: 16px; line-height: 1.7; color: #334155; margin-bottom: 1.25rem;">
          In modern computer engineering, designing distributed architectures requires a strong balance between <b>algorithmic efficiency</b> and <i>robust network design</i>. Students must understand how <u>data structures like hash maps, binary search trees, and graphs</u> operate at scale.
        </p>

        <figure style="float: left; margin: 0.5rem 1.5rem 1rem 0; max-width: 50%;" class="blog-fitted-image align-left">
          <img src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800" alt="Microservices Circuit Architecture" style="width: 100%; max-width: 350px; height: auto; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.08);" class="rounded-xl shadow-sm inline-block" />
          <figcaption style="font-size: 0.85rem; color: #64748b; margin-top: 0.5rem; font-style: italic; text-align: center;">Diagram 1: Microservices Circuit Hardware Architecture (Fitted Left 50%)</figcaption>
        </figure>

        <p style="font-size: 16px; line-height: 1.7; color: #334155; margin-bottom: 1.25rem;">
          As shown in <i>Diagram 1 (fitted float-left above)</i>, microservices decouple legacy monolithic systems into small, independent services. Each service communicates asynchronously using HTTP REST or gRPC protocols.
        </p>

        <h3 style="font-family: Calibri, sans-serif; font-size: 24px; font-weight: bold; color: #0369a1; margin-top: 2rem; margin-bottom: 1rem; clear: both;">
          <u>2. Key Performance Metrics & Time Complexity</u>
        </h3>

        <p style="font-size: 16px; line-height: 1.7; color: #334155; margin-bottom: 1.25rem;">
          When evaluating backend performance, engineers measure:
        </p>

        <ul style="font-family: 'Times New Roman', Times, serif; font-size: 18px; line-height: 1.8; color: #1e293b; margin-left: 1.5rem; margin-bottom: 1.5rem;">
          <li><b>Latency:</b> Time taken for a request to receive a response.</li>
          <li><i>Throughput:</i> Number of requests processed per second (RPS).</li>
          <li><u>Big-O Asymptotic Upper Bounds:</u> Ensuring average operations remain within <b>O(log N)</b> or <b>O(1)</b> lookup time.</li>
        </ul>

        <figure style="margin: 2rem auto; text-align: center; clear: both; display: block;" class="blog-fitted-image align-center">
          <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1000" alt="Data Analytics & Algorithm Performance Chart" style="max-width: 100%; height: auto; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); object-fit: contain;" class="rounded-xl shadow-sm inline-block" />
          <figcaption style="font-size: 0.85rem; color: #64748b; margin-top: 0.5rem; font-style: italic; text-align: center;">Figure 2: Real-time System Metrics & Dashboard (Fitted Center 100%)</figcaption>
        </figure>

        <p style="font-size: 16px; line-height: 1.7; color: #334155; margin-top: 1rem;">
          <span style="font-size: 20px; font-weight: bold; color: #0284c7;">Summary Advice for Students:</span><br />
          Always test your code with edge cases! Visualizing pointer movements and keeping track of network timeouts will guarantee successful project submissions and high exam performance.
        </p>

      </div>
    `;

    const post = await prisma.blogPost.create({
      data: {
        teacherId: teacher.id,
        title: sampleTitle,
        slug: sampleSlug,
        summary: sampleSummary,
        content: sampleContent,
        coverImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800',
        isPublished: true,
        viewCount: 15,
        estimatedReadingMinutes: 4,
      },
    });

    console.log('✅ TEST SUCCESS: Created Blog Post in DB!');
    console.log('Post ID:', post.id);
    console.log('Post Title:', post.title);
    console.log('Post Slug:', post.slug);
    console.log('Author:', teacher.fullName);

    const fetched = await prisma.blogPost.findUnique({
      where: { id: post.id },
      include: { teacher: true },
    });

    if (fetched && fetched.teacher?.fullName === teacher.fullName) {
      console.log('✅ VERIFICATION PASSED: Blog Post retrieved cleanly with Teacher relation!');
      console.log('Content Length:', fetched.content.length, 'bytes');
      console.log('Contains Calibri:', fetched.content.includes('Calibri'));
      console.log('Contains Times New Roman:', fetched.content.includes('Times New Roman'));
      console.log('Contains Fitted Image Figure:', fetched.content.includes('blog-fitted-image'));
    } else {
      throw new Error('Verification failed: Post or teacher relation missing');
    }

  } catch (err) {
    console.error('❌ TEST FAILED:', err);
  } finally {
    await prisma.$disconnect();
  }
}

runBloggingSystemTest();
