import Link from "next/link";
import Image from "next/image";
export default function Dashboard() {
  return (
    <div id="wd-dashboard">
      <h1 id="wd-dashboard-title">Dashboard</h1> <hr />
      <h2 id="wd-dashboard-published">Published Courses (7)</h2> <hr />
      <div id="wd-dashboard-courses">
        <div className="wd-dashboard-course">
          <Link href="/courses/COOP3945" className="wd-dashboard-course-link">
            <Image src="/images/COOP3945.jpg" width={200} height={150} alt="Co-op Work Experience" />
            <div>
              <h5>COOP3945 15172 Co-op Work Experience SEC 137 Fall 2025 [XCR-1-CO]</h5>
              <p className="wd-dashboard-course-title">
                Term: 202610_1 Fall 2025 Semester Full Term
              </p>
              <button> Go </button>
            </div>
          </Link>
        </div>
        <div className="wd-dashboard-course">
          <Link href="/courses/CS1210" className="wd-dashboard-course-link">
            <Image src="/images/CS1210.png" width={200} height={150} alt="Professional Development Co-op" />
            <div>
              <h5>CS1210 32831 Professional Development Co-op SEC 06 Spring 2025 [VTL-1-OL]</h5>
              <p className="wd-dashboard-course-title">
                Term: 202530_1 Spring 2025 Semester Full Term
              </p>
              <button> Go </button>
            </div>
          </Link>
        </div>
        <div className="wd-dashboard-course">
          <Link href="/courses/CS3800" className="wd-dashboard-course-link">
            <Image src="/images/CS3800.webp" width={200} height={150} alt="Theory of Computation" />
            <div>
              <h5>CS3800 30280 Theory of Computation SEC 01 Spring 2026 [BOS-1-TR]</h5>
              <p className="wd-dashboard-course-title">
                Term: 202630_1 Spring 2026 Semester Full Term
              </p>
              <button> Go </button>
            </div>
          </Link>
        </div>
        <div className="wd-dashboard-course">
          <Link href="/courses/CS4550" className="wd-dashboard-course-link">
            <Image src="/images/CS4550.png" width={200} height={150} alt="Web Development" />
            <div>
              <h5>CS4550 33211 Web Development SEC 02 Spring 2026 [VTL-1-OL]</h5>
              <p className="wd-dashboard-course-title">
                Term: 202630_1 Spring 2026 Semester Full Term
              </p>
              <button> Go </button>
            </div>
          </Link>
        </div>
        <div className="wd-dashboard-course">
          <Link href="/courses/DS4440" className="wd-dashboard-course-link">
            <Image src="/images/DS4440.jpg" width={200} height={150} alt="Practical Neural Networks" />
            <div>
              <h5>DS4440 33162 Practical Neural Networks SEC 02 Spring 2026 [BOS-1-TR]</h5>
              <p className="wd-dashboard-course-title">
                Term: 202630_1 Spring 2026 Semester Full Term
              </p>
              <button> Go </button>
            </div>
          </Link>
        </div>
        <div className="wd-dashboard-course">
          <Link href="/courses/EECE2310" className="wd-dashboard-course-link">
            <Image src="/images/EECE2310.jpg" width={200} height={150} alt="Intro Digital Design Comp Arch" />
            <div>
              <h5>EECE2310 33851 Intro Digital Design Comp Arch SEC 01 Spring 2026 [BOS-1-TR]</h5>
              <p className="wd-dashboard-course-title">
                Term: 202630_1 Spring 2026 Semester Full Term
              </p>
              <button> Go </button>
            </div>
          </Link>
        </div>
        <div className="wd-dashboard-course">
          <Link href="/courses/EECE2311" className="wd-dashboard-course-link">
            <Image src="/images/EECE2311.jpg" width={200} height={150} alt="Lab for EECE 2310" />
            <div>
              <h5>EECE2311 33860 Lab for EECE 2310 SEC 05 Spring 2026 [BOS-1-TR]</h5>
              <p className="wd-dashboard-course-title">
                Term: 202630_1 Spring 2026 Semester Full Term
              </p>
              <button> Go </button>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
