const dns = require('dns');
if (typeof dns.setDefaultResultOrder === 'function') {
  dns.setDefaultResultOrder('ipv4first');
}

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });
const connectDB = require('../config/db');
const Blog = require('../models/blogModel');

const BSC_NUTRITION_BLOG = {
  slug: 'bsc-nutrition-and-dietetics-distance-education',
  title: 'BSc Nutrition and Dietetics Distance Education Admission 2026: Eligibility, Fees, Syllabus, Top Colleges & Career Scope',
  metaTitle: 'BSc Nutrition & Dietetics Distance Education 2026 | Fees & Scope',
  metaDescription: 'Complete guide for BSc Nutrition and Dietetics Distance Education Admission 2026. Explore eligibility after 12th, affordable fees, clinical syllabus, top universities & dietitian careers.',
  focusKeyword: 'BSc Nutrition and Dietetics Distance Education',
  category: 'Courses',
  tags: [
    'BSc Nutrition and Dietetics Distance Education',
    'Distance BSc Nutrition',
    'Dietetics Distance Education 2026',
    'BSc Nutrition Fees',
    'BSc Nutrition Syllabus',
    'BSc Dietetics Eligibility',
    'Clinical Nutrition Distance Course',
    'Nutritionist Career Scope',
    'Dietitian Salary',
    'Distance Education Admission 2026'
  ],
  excerpt: 'BSc Nutrition and Dietetics Distance Education admission 2026 is officially open across leading UGC-DEB approved universities. Learn about eligibility rules after 12th, affordable fee breakdown, clinical dietetics syllabus, top universities, and high-growth careers in health & wellness.',
  coverImage: {
    url: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1200&auto=format&fit=crop&q=80',
    publicId: ''
  },
  imageAlt: 'BSc Nutrition and Dietetics Distance Education Admission 2026',
  authorName: 'Aniket Kumar',
  status: 'Draft',
  published: false,
  updatedDate: new Date(),
  content: `
<p><strong>BSc Nutrition and Dietetics Distance Education Admission 2026:</strong> Admission registrations for the Bachelor of Science (B.Sc) in Nutrition and Dietetics through distance and open learning have officially started across leading UGC-DEB recognized universities for the 2026-27 academic session. As lifestyle awareness, preventative wellness, and clinical healthcare demand surge across India, BSc Nutrition and Dietetics has emerged as one of the most promising undergraduate healthcare science programs. It equips aspiring dietitians, nutrition counselors, and healthcare consultants with scientific knowledge in human physiology, therapeutic diet planning, food biochemistry, and clinical nutrition without requiring daily physical classroom attendance. The tentative last date to submit online application forms is <strong>31 August 2026*</strong>.</p>

<p>Distance and open learning formats in BSc Nutrition and Dietetics are designed with academic flexibility to accommodate working healthcare staff, fitness professionals, and science students. Modern institutions offer interactive multimedia Learning Management Systems (LMS), digitized e-modules, recorded masterclasses by experienced clinical dietitians, and mandatory practical contact programs/virtual laboratory sessions. Conferred by UGC-DEB recognized universities, this 3-year bachelor's degree establishes a solid platform for professional roles in wellness centers, hospitals, sports academies, food processing units, and postgraduate studies like M.Sc Clinical Nutrition or PG Diploma in Dietetics.</p>

<div class="blog-table-responsive" style="background:#f8fafc; border-left:4px solid #2563eb; padding:14px 18px; margin:20px 0; border-radius:4px;">
  <p style="margin:0; font-weight:700; color:#1e293b; font-size:16px;"><strong>BSc Nutrition and Dietetics Distance Education Admission 2026 Latest Updates:</strong></p>
  <ul style="margin:8px 0 0 0; padding-left:20px; color:#334155; line-height:1.6;">
    <li>Undergraduate admission portals are live for the 2026-27 academic session across open and state distance learning universities.</li>
    <li>The tentative closing date for online application submission and document verification is <strong>31 August 2026*</strong>.</li>
    <li>Admissions are conducted strictly on a <strong>merit basis</strong> based on 10+2 scores; no state or national entrance exam is mandatory.</li>
    <li>Students with a 10+2 Science (PCB/PCMB) or Home Science background are given direct preference for admission.</li>
  </ul>
</div>

<h2>BSc Nutrition and Dietetics Distance Education Highlights 2026</h2>
<p>Below is a comprehensive summary of key program parameters for Bachelor of Science in Nutrition and Dietetics through distance learning mode:</p>

<div class="blog-table-responsive">
  <table style="width:100%; border-collapse:collapse; margin:16px 0;">
    <thead>
      <tr style="background:#f1f5f9; text-align:left;">
        <th style="padding:10px 12px; border:1px solid #cbd5e1;">Particulars</th>
        <th style="padding:10px 12px; border:1px solid #cbd5e1;">Program Details</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;"><strong>Program Name</strong></td>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;">Bachelor of Science in Nutrition and Dietetics (Distance BSc Nutrition / Dietetics)</td>
      </tr>
      <tr>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;"><strong>Program Level</strong></td>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;">Undergraduate (UG) Degree in Allied Healthcare Sciences</td>
      </tr>
      <tr>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;"><strong>Course Duration</strong></td>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;">3 Years (Divided into 6 Semesters / Annual Pattern) | Max Time: 5 to 6 Years</td>
      </tr>
      <tr>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;"><strong>Eligibility Criteria</strong></td>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;">10+2 from a recognized board with Science (PCB) or Home Science (min 45% - 50% marks)</td>
      </tr>
      <tr>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;"><strong>Admission Process</strong></td>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;">Merit-Based Direct Admission (Based on 10+2 qualifying marks)</td>
      </tr>
      <tr>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;"><strong>Average Course Fees</strong></td>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;">INR 45,000 to INR 1,20,000 (Entire 3-Year Program depending on University)</td>
      </tr>
      <tr>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;"><strong>Statutory Approvals</strong></td>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;">UGC-DEB, AIU Recognized &amp; NAAC Accredited Universities</td>
      </tr>
      <tr>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;"><strong>Learning Mode</strong></td>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;">Self-Paced Digital Study Material + Weekend Practical Contact Camps</td>
      </tr>
      <tr>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;"><strong>Average Entry-level Salary</strong></td>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;">INR 3,50,000 to INR 8,00,000 per annum</td>
      </tr>
    </tbody>
  </table>
</div>

<h2>What is BSc Nutrition and Dietetics Distance Education?</h2>
<p>BSc Nutrition and Dietetics is an interdisciplinary applied science degree that explores the intimate relationship between food chemistry, metabolic human biology, clinical health, and disease prevention. The course investigates how macro and micronutrients influence bodily functions, immunity, and cellular repair, while teaching learners how to formulate individualized dietary charts for individuals suffering from conditions such as diabetes, hypertension, renal disorders, gastrointestinal diseases, and obesity.</p>

<p>Through a blend of digitized theoretical modules, nutritional case studies, food quality testing principles, and scheduled practical contact classes, distance learners develop the core diagnostic and consultative competencies required of modern nutritional experts without the rigid constraints of daily campus commutes.</p>

<h2>Why Choose BSc Nutrition and Dietetics in Distance Mode?</h2>
<p>Pursuing this program in distance or online learning format offers notable lifestyle and professional benefits:</p>
<ul>
  <li><strong>Booming Health &amp; Wellness Industry:</strong> The post-pandemic era has led to massive demand for certified nutritionists and dietitians in multi-specialty hospitals, gyms, sports clubs, corporate wellness centers, and private clinical consulting.</li>
  <li><strong>Unmatched Flexibility for Working Adults:</strong> Nurses, gym trainers, health counselors, and pharmacy technicians can upgrade their academic credentials to a recognized Bachelor of Science degree while continuing their existing professional duties.</li>
  <li><strong>Significant Financial Economy:</strong> Regular on-campus BSc Nutrition degrees at private medical colleges cost ₹2 Lakhs to ₹5 Lakhs. Distance programs cost only ₹45,000 to ₹1,20,000 for the entire 3-year course.</li>
  <li><strong>Entrepreneurial Opportunities:</strong> Graduates can establish independent online wellness clinics, start healthy food preparation ventures, or offer corporate dietary consulting remotely.</li>
  <li><strong>Clear Progression to Master&apos;s Degrees:</strong> Serves as an accredited foundation to pursue M.Sc Clinical Nutrition, M.Sc Food Science, or specialized PG diplomas in Dietetics and Public Health Nutrition.</li>
</ul>

<h2>BSc Nutrition and Dietetics Distance Education Eligibility Criteria 2026</h2>
<p>Prospective applicants must satisfy the following academic prerequisites:</p>
<ul>
  <li><strong>Educational Benchmark:</strong> Successful completion of Class 10+2 (Higher Secondary) or recognized equivalent examination from CBSE, ICSE, NIOS, or State Education Boards.</li>
  <li><strong>Subject Combinations:</strong> Candidates must have studied <strong>Science with Physics, Chemistry, and Biology (PCB)</strong>, or Home Science / Clinical Nutrition as elective subjects. Several open universities also consider candidates with Mathematics or Allied Health vocational subjects.</li>
  <li><strong>Minimum Percentage:</strong> An aggregate of at least <strong>45% to 50% marks</strong> in 10+2 (40% to 45% for SC/ST/OBC and reserved categories as per government regulations).</li>
  <li><strong>No Entrance Exam:</strong> Admissions are conducted directly based on merit in 10+2 qualifying examinations; no NEET or national entrance exam is mandated.</li>
</ul>

<h2>Practical Training &amp; Laboratory Sessions</h2>
<p>Because Nutrition and Dietetics involves practical food chemistry, dietary calculation, and body composition analysis, recognized distance education universities conduct <strong>Compulsory Practical Contact Programs (PCP)</strong>. These are held during weekends or term breaks at designated regional study centers or affiliated hospital laboratories, ensuring that distance learners gain essential hands-on experience in:</p>
<ul>
  <li>Food testing, adulteration detection, and microbiology examination.</li>
  <li>Anthropometric measurements, BMI assessment, and basal metabolic rate (BMR) calculations.</li>
  <li>Formulation of therapeutic diet charts for diabetes, cardiovascular, renal, and pediatric conditions.</li>
  <li>Food preservation methods and culinary nutrient retention techniques.</li>
</ul>

<h2>BSc Nutrition and Dietetics Distance Education Fees Structure 2026</h2>
<p>Distance and open universities maintain affordable tuition structures with flexible annual or semester-wise installment schedules:</p>

<div class="blog-table-responsive">
  <table style="width:100%; border-collapse:collapse; margin:16px 0;">
    <thead>
      <tr style="background:#f1f5f9; text-align:left;">
        <th style="padding:10px 12px; border:1px solid #cbd5e1;">University Name</th>
        <th style="padding:10px 12px; border:1px solid #cbd5e1;">University Type</th>
        <th style="padding:10px 12px; border:1px solid #cbd5e1;">Per Year Fee (Approx.)</th>
        <th style="padding:10px 12px; border:1px solid #cbd5e1;">Total Course Fee (Approx.)</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;"><strong>Tamil Nadu Open University (TNOU)</strong></td>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;">State Open University</td>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;">INR 14,000</td>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;">INR 42,000</td>
      </tr>
      <tr>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;"><strong>Periyar University (PRIDE)</strong></td>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;">State University (NAAC A)</td>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;">INR 16,500</td>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;">INR 49,500</td>
      </tr>
      <tr>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;"><strong>Madurai Kamaraj University (DDE)</strong></td>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;">State University (NAAC A++)</td>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;">INR 15,000</td>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;">INR 45,000</td>
      </tr>
      <tr>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;"><strong>Karnataka State Open University (KSOU)</strong></td>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;">State Open University</td>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;">INR 18,000</td>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;">INR 54,000</td>
      </tr>
      <tr>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;"><strong>Annamalai University (DDE)</strong></td>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;">State University (NAAC A+)</td>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;">INR 17,500</td>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;">INR 52,500</td>
      </tr>
      <tr>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;"><strong>Private Allied Universities / Online Portals</strong></td>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;">Private Deemed / NAAC A</td>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;">INR 30,000 - 40,000</td>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;">INR 90,000 - 1,20,000</td>
      </tr>
    </tbody>
  </table>
</div>

<h2>BSc Nutrition and Dietetics Distance Education Syllabus &amp; Subjects</h2>
<p>The academic curriculum spans 3 years (organized in either 6 semesters or 3 annual parts), covering clinical, biological, and practical dimensions of dietetics:</p>

<div class="blog-table-responsive">
  <table style="width:100%; border-collapse:collapse; margin:16px 0;">
    <thead>
      <tr style="background:#f1f5f9; text-align:left;">
        <th style="padding:10px 12px; border:1px solid #cbd5e1;">Year / Level</th>
        <th style="padding:10px 12px; border:1px solid #cbd5e1;">Core Subjects &amp; Practical Modules</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;"><strong>Year 1 (Foundations)</strong></td>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;">Human Physiology &amp; Anatomy, Basics of Food Science, Introduction to Nutritional Biochemistry, Microbiology &amp; Food Hygiene, Family Meal Management, Food Science Practical Lab.</td>
      </tr>
      <tr>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;"><strong>Year 2 (Applied Nutrition)</strong></td>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;">Nutritional Biochemistry II, Human Nutrition through Life Cycle (Infancy to Geriatrics), Community Nutrition &amp; Public Health, Food Preservation &amp; Quality Control, Diet Planning Practical Lab.</td>
      </tr>
      <tr>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;"><strong>Year 3 (Clinical Dietetics)</strong></td>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;">Clinical Nutrition &amp; Diet Therapy (Diabetes, Cardiac, Renal, Oncology), Food Service Management &amp; Hospitality Administration, Sports Nutrition &amp; Fitness, Research Methodology &amp; Project Report / Hospital Internship Case Studies.</td>
      </tr>
    </tbody>
  </table>
</div>

<h2>Top Career Specializations in Nutrition &amp; Dietetics</h2>
<p>Students can direct their career trajectory toward specialized fields:</p>
<ul>
  <li><strong>Clinical Dietetics:</strong> Working inside hospitals, multispecialty clinics, and nursing homes to design tailored inpatient and outpatient therapeutic meal regimens.</li>
  <li><strong>Sports &amp; Athletic Nutrition:</strong> Advising athletes, bodybuilders, and fitness professionals on nutrient timing, hydration strategies, and ergogenic supplementation.</li>
  <li><strong>Pediatric &amp; Maternal Nutrition:</strong> Specializing in infant feeding guidelines, childhood growth monitoring, and pre/post-natal maternal diets.</li>
  <li><strong>Public Health Nutrition:</strong> Collaborating with NGOs, UNICEF, WHO projects, and government healthcare missions (like POSHAN Abhiyaan) to combat malnutrition.</li>
  <li><strong>Food Processing &amp; Quality Assurance:</strong> Ensuring nutritional labeling compliance, shelf-life integrity, and FSSAI safety benchmarks in FMCG food industries.</li>
</ul>

<h2>Step-by-Step Admission Process 2026</h2>
<p>Enrolling in BSc Nutrition and Dietetics via distance learning involves 5 straightforward steps:</p>
<ol>
  <li><strong>Online Portal Registration:</strong> Visit the official distance education web portal of your selected university and register with a valid email address and phone number.</li>
  <li><strong>Application Form Completion:</strong> Fill out your personal details, correspondence address, and 10th/12th academic qualification marks.</li>
  <li><strong>Document Upload:</strong> Upload scanned digital copies of your Class 10th and 12th mark sheets, proof of birth date, Aadhaar card, and recent colored passport photograph.</li>
  <li><strong>Tuition Fee Payment:</strong> Pay the application fee and first-year tuition fee securely using UPI, Net Banking, or Credit/Debit Card.</li>
  <li><strong>Admission Confirmation:</strong> The university admissions cell verifies your documents and dispatches your official enrollment letter, student identity card, and LMS credentials.</li>
</ol>

<h2>Documents Required for Admission</h2>
<p>Ensure you have digital scans of the following credentials ready before applying:</p>
<ul>
  <li>Class 10th Board Certificate and Marksheet (proof of date of birth).</li>
  <li>Class 12th Higher Secondary (PCB/Science) Marksheet and Passing Certificate.</li>
  <li>Valid Government Photo Identity Proof (Aadhaar Card, Passport, or Voter ID).</li>
  <li>Recent passport-sized color photographs against a light background.</li>
  <li>Category / Caste Certificate (if seeking reservation or scholarship fee concessions).</li>
  <li>Transfer Certificate (TC) or Migration Certificate (if required by the specific university).</li>
</ul>

<h2>Career Opportunities &amp; Salary After Distance BSc Nutrition</h2>
<p>Graduates hold lucrative career avenues across healthcare, wellness, hospitality, and fitness sectors:</p>

<div class="blog-table-responsive">
  <table style="width:100%; border-collapse:collapse; margin:16px 0;">
    <thead>
      <tr style="background:#f1f5f9; text-align:left;">
        <th style="padding:10px 12px; border:1px solid #cbd5e1;">Job Profile</th>
        <th style="padding:10px 12px; border:1px solid #cbd5e1;">Core Responsibilities</th>
        <th style="padding:10px 12px; border:1px solid #cbd5e1;">Average Salary (Per Annum)</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;"><strong>Clinical Dietitian / Nutritionist</strong></td>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;">Formulating therapeutic diets for hospital patients, evaluating nutritional deficiencies, and monitoring post-operative recovery.</td>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;">INR 3,80,000 - 7,50,000</td>
      </tr>
      <tr>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;"><strong>Sports &amp; Fitness Nutritionist</strong></td>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;">Advising gym members, athletes, and fitness clients on macronutrient splits, body recomposition, and athletic performance diets.</td>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;">INR 4,20,000 - 8,50,000</td>
      </tr>
      <tr>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;"><strong>Food Quality &amp; Safety Executive</strong></td>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;">Inspecting hygiene standards, auditing nutritional label claims, and ensuring FSSAI regulatory compliance in food manufacturing.</td>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;">INR 3,50,000 - 6,50,000</td>
      </tr>
      <tr>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;"><strong>Public Health &amp; Community Nutritionist</strong></td>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;">Coordinating rural health nutrition drives, government feeding programs, and maternal health educational workshops.</td>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;">INR 3,20,000 - 5,80,000</td>
      </tr>
      <tr>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;"><strong>Corporate Wellness Consultant</strong></td>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;">Conducting employee health seminars, desk-diet counseling, and healthy cafeteria menu planning for IT/MNC corporations.</td>
        <td style="padding:10px 12px; border:1px solid #cbd5e1;">INR 4,50,000 - 9,00,000</td>
      </tr>
    </tbody>
  </table>
</div>

<h2>Higher Education Scope After BSc Nutrition &amp; Dietetics</h2>
<p>A bachelor&apos;s degree in Nutrition and Dietetics unlocks elite postgraduate pathways for specialized advancement:</p>
<ul>
  <li><strong>M.Sc in Clinical Nutrition:</strong> Advanced study into metabolic disorders, parenteral/enteral clinical nutrition, and clinical pharmacology.</li>
  <li><strong>M.Sc in Food Science &amp; Technology:</strong> Focuses on industrial food processing, preservation chemistry, and food packaging technology.</li>
  <li><strong>PG Diploma in Dietetics &amp; Public Health Nutrition (DDPHN):</strong> An industry-accredited credential ideal for clearing the Registered Dietitian (RD) examination conducted by the Indian Dietetic Association (IDA).</li>
  <li><strong>MBA in Healthcare &amp; Hospital Management:</strong> Merges clinical nutrition understanding with hospital administration and executive leadership.</li>
</ul>

<h2>Frequently Asked Questions (FAQs)</h2>
<div style="margin-top:16px;">
  <p><strong>Q: Is BSc Nutrition and Dietetics Distance Education degree valid for government jobs?</strong><br/>
  <strong>A:</strong> Yes. Degrees conferred by universities recognized by the UGC-DEB (Distance Education Bureau) and AIU hold full statutory equivalence to regular on-campus degrees for state health departments, Food Corporation of India (FCI), FSSAI food inspector posts, SSC, and UPSC civil services examinations.</p>

  <p><strong>Q: Can I become a Registered Dietitian (RD) in India through a distance BSc degree?</strong><br/>
  <strong>A:</strong> To qualify for the Registered Dietitian (RD) examination administered by the Indian Dietetic Association (IDA), candidates typically require a degree in Nutrition &amp; Dietetics followed by a PG Diploma or M.Sc and a mandatory 6-month clinical internship in an IDA-recognized hospital. Pursuing an accredited PG Diploma or regular master's program after your distance BSc establishes complete eligibility.</p>

  <p><strong>Q: Can Arts or Commerce students apply for BSc Nutrition and Dietetics?</strong><br/>
  <strong>A:</strong> Most universities mandate a Science background (10+2 with Physics, Chemistry, Biology) or Home Science. However, certain open universities (like TNOU or IGNOU allied diplomas) offer foundational bridge certificates for non-science students to help them transition into nutrition studies.</p>

  <p><strong>Q: What is the last date to apply for BSc Nutrition and Dietetics Distance Education 2026?</strong><br/>
  <strong>A:</strong> The tentative last date for submitting online application forms across leading open universities for the 2026 academic batch is <strong>31 August 2026*</strong>.</p>

  <p><strong>Q: Are practical classes compulsory in distance BSc Nutrition programs?</strong><br/>
  <strong>A:</strong> Yes, recognized distance universities conduct mandatory weekend Practical Contact Programs (PCPs) at designated affiliated laboratories and hospitals to ensure learners gain indispensable diagnostic and dietary planning competencies.</p>
</div>
`
};

async function insertBscNutrition() {
  console.log('Connecting to MongoDB Atlas...');
  await connectDB();
  console.log('MongoDB connected successfully.');

  console.log(`\nProcessing: "${BSC_NUTRITION_BLOG.title}" (slug: ${BSC_NUTRITION_BLOG.slug})...`);

  const existing = await Blog.findOne({ slug: BSC_NUTRITION_BLOG.slug });

  if (existing) {
    console.log(`Blog with slug "${BSC_NUTRITION_BLOG.slug}" already exists. Updating content and ensuring Draft status...`);
    existing.title = BSC_NUTRITION_BLOG.title;
    existing.metaTitle = BSC_NUTRITION_BLOG.metaTitle;
    existing.metaDescription = BSC_NUTRITION_BLOG.metaDescription;
    existing.focusKeyword = BSC_NUTRITION_BLOG.focusKeyword;
    existing.category = BSC_NUTRITION_BLOG.category;
    existing.tags = BSC_NUTRITION_BLOG.tags;
    existing.excerpt = BSC_NUTRITION_BLOG.excerpt;
    existing.content = BSC_NUTRITION_BLOG.content;
    existing.coverImage = BSC_NUTRITION_BLOG.coverImage;
    existing.imageAlt = BSC_NUTRITION_BLOG.imageAlt;
    existing.authorName = BSC_NUTRITION_BLOG.authorName;
    existing.status = 'Draft';
    existing.published = false;
    existing.updatedDate = new Date();
    await existing.save();
    console.log(`✓ Updated "${BSC_NUTRITION_BLOG.slug}" as Draft successfully.`);
  } else {
    const newBlog = new Blog({
      title: BSC_NUTRITION_BLOG.title,
      metaTitle: BSC_NUTRITION_BLOG.metaTitle,
      metaDescription: BSC_NUTRITION_BLOG.metaDescription,
      focusKeyword: BSC_NUTRITION_BLOG.focusKeyword,
      slug: BSC_NUTRITION_BLOG.slug,
      category: BSC_NUTRITION_BLOG.category,
      tags: BSC_NUTRITION_BLOG.tags,
      coverImage: BSC_NUTRITION_BLOG.coverImage,
      imageAlt: BSC_NUTRITION_BLOG.imageAlt,
      excerpt: BSC_NUTRITION_BLOG.excerpt,
      content: BSC_NUTRITION_BLOG.content,
      authorName: BSC_NUTRITION_BLOG.authorName,
      status: 'Draft',
      published: false,
      updatedDate: new Date(),
      views: 0
    });

    await newBlog.save();
    console.log(`✓ Created new blog "${BSC_NUTRITION_BLOG.slug}" as Draft successfully.`);
  }

  // Verification
  const saved = await Blog.findOne({ slug: BSC_NUTRITION_BLOG.slug }).lean();
  console.log('\n=============================================');
  console.log('VERIFIED IN DATABASE:');
  console.log('Title:', saved.title);
  console.log('Slug:', saved.slug);
  console.log('Status:', saved.status);
  console.log('Published:', saved.published);
  console.log('Category:', saved.category);
  console.log('Content Length:', saved.content.length);
  console.log('Cover Image:', saved.coverImage?.url);
  console.log('=============================================');

  const totalDrafts = await Blog.countDocuments({ status: 'Draft' });
  const totalPublished = await Blog.countDocuments({ status: 'Published' });
  console.log(`Current DB Totals: ${totalDrafts} Drafts | ${totalPublished} Published | Total ${totalDrafts + totalPublished}`);

  await mongoose.disconnect();
  console.log('\nMongoDB disconnected.');
}

insertBscNutrition().catch(err => {
  console.error('Fatal error drafting BSc Nutrition blog:', err);
  process.exit(1);
});
