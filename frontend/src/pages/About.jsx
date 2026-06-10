import about1 from "../assets/about1.webp";
import about2 from "../assets/about2.jpg";
import {FaHeart,FaBullseye,FaLayerGroup,FaWandMagicSparkles,FaShieldHalved,FaCircleCheck} from "react-icons/fa6";

export const ABOUT_IMAGE_MISSION = about1;
export const ABOUT_IMAGE_OFFER = about2;

function SectionIcon({ icon: Icon, label }) {
  return (
    <div
      className="about-section-icon flex-shrink-0 d-flex align-items-center justify-content-center rounded-3"
      role="img"
      aria-label={label}
    >
      <Icon size={20} />
    </div>
  );
}

function AboutImageBlock({ src, alt, className }) {
  if (!src) {
    return (
      <div
        className={
          "about-img-placeholder rounded-4 d-flex align-items-center justify-content-center text-muted small border border-2 border-dashed " +
          (className || "")
        }
        aria-hidden="true"
      >
        <span className="text-center px-3">
          Image — set src in About.jsx
        </span>
      </div>
    );
  }

  return (
    <div
      className={
        "about-feature-img rounded-4 overflow-hidden shadow " +
        (className || "")
      }
    >
      <img
        src={src}
        alt={alt}
        className="w-100 h-100 object-fit-cover"
      />
    </div>
  );
}

export default function About() {
  return (
    <div className="about-page pb-5">
      <section className="about text-white mb-5">
        <div className="container py-5">
          <div className="row align-items-center g-4">
            <div className="col-lg-8">
              <p className="small text-uppercase text-white text-opacity-50 fw-semibold mb-2">
                About HostelHub
              </p>

              <h1 className="display-5 fw-bold mb-3">
                Verified living, simplified
              </h1>

              <p
                className="lead text-white text-opacity-75 mb-0"
                style={{ maxWidth: "36rem" }}
              >
                Finding or offering a place to live shouldn&apos;t feel overwhelming.
                HostelHub makes it easier to discover, connect, and move forward
                with confidence.
              </p>
            </div>
            <div className="col-lg-4 d-flex justify-content-lg-end">
              <SectionIcon
                icon={FaShieldHalved}
                label="Verified living"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-5 border-bottom">
        <div className="container">
          <div className="row align-items-center g-4 g-lg-5">
            <div className="col-lg-6">
              <div className="d-flex gap-3">
                <SectionIcon icon={FaBullseye} />
                <div>
                  <h2 className="h3 fw-bold mb-3">
                    Making everyday living easier
                  </h2>
                  <p className="text-muted mb-3">
                    Our mission is to simplify how people find and share living spaces.
                    Whether you're moving to a new city, starting college, or settling
                    into a new routine, the process should feel clear, reliable, and
                    stress-free.
                  </p>

                  <p className="text-muted mb-0">
                    HostelHub is built to remove that friction and make every step
                    feel straightforward.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <AboutImageBlock
                src={ABOUT_IMAGE_MISSION}
                alt="HostelHub mission"
                className="about-img-tall mx-lg-auto"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-5 border-bottom bg-light">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="d-flex gap-3">
                <SectionIcon icon={FaHeart} />
                <div>
                  <h2 className="h3 fw-bold mb-3">
                    Built around real-life transitions
                  </h2>
                  <p className="text-muted mb-3">
                    Where you live shapes your daily life—your routines, your comfort,
                    and your sense of stability. Every space has a story, shaped by
                    the people who create it and the people who move in.
                  </p>
                  <p className="text-muted mb-3">
                    We believe better experiences come from better connections—when
                    the right people find the right spaces, without unnecessary complexity.
                  </p>
                  <p className="text-muted mb-0 fw-medium">
                    That&apos;s the experience we&apos;re here to create.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-5 border-bottom">
        <div className="container">
          <div className="row align-items-center g-4 g-lg-5">
            <div className="col-lg-6 order-lg-2">
              <div className="d-flex gap-3">
                <SectionIcon icon={FaLayerGroup} />
                <div>
                  <h2 className="h3 fw-bold mb-3">
                    A space for every journey
                  </h2>
                  <p className="text-muted mb-3">
                    From PGs and shared hostels to independent apartments,
                    HostelHub brings together a wide range of living options
                    in one place.
                  </p>
                  <p className="text-muted mb-3">
                    Each listing is verified and presented with clarity—so you
                    can explore, compare confidently, and decide without
                    second-guessing.
                  </p>

                  <p className="text-muted mb-0">
                    No two journeys are the same—and the right space makes all
                    the difference.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-lg-6 order-lg-1">
              <AboutImageBlock
                src={ABOUT_IMAGE_OFFER}
                alt="Living options on HostelHub"
                className="about-img-tall mx-lg-auto"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-5 border-bottom bg-light">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="d-flex gap-3">
                <SectionIcon icon={FaWandMagicSparkles} />
                <div>
                  <h2 className="h3 fw-bold mb-3">
                    Designed to keep things simple
                  </h2>
                  <p className="text-muted mb-3">
                    HostelHub is built to make the entire experience seamless—
                    from discovery to move-in.
                  </p>

                  <p className="text-muted mb-0">
                    Intuitive search and filters, clear listing details, and tools
                    to manage and update spaces—everything is designed to reduce
                    effort and increase trust at every step.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-5">
        <div className="container">
          <div className="about-closing rounded-4 p-4 p-lg-5 text-white">

            <div className="d-flex flex-column flex-md-row gap-3 align-items-md-start">
              <SectionIcon icon={FaCircleCheck} />
              <div>
                <h2 className="h3 fw-bold mb-3">Why HostelHub</h2>
                <p
                  className="text-white text-opacity-75 mb-3 mb-md-0"
                  style={{ maxWidth: "40rem" }}
                >
                  Because finding or offering a place to live should feel like
                  progress—not a process filled with uncertainty.
                </p>
                <p
                  className="text-white text-opacity-75 mb-0"
                  style={{ maxWidth: "40rem" }}
                >
                  With verified listings and a focus on simplicity, HostelHub
                  helps turn important life transitions into smoother, more
                  confident steps forward.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}