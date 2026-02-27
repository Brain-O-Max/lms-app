'use client';

import DashboardLayout from '@/components/DashboardLayout';
import Modal from '@/components/Modal';
import { useAuth } from '@/lib/auth-context';
import { demoCourses } from '@/lib/demo-data';
import { Course } from '@/lib/types';
import { useState } from 'react';

export default function CoursesPage() {
  const { userRole } = useAuth();
  const [courses, setCourses] = useState<Course[]>(demoCourses);
  const [showModal, setShowModal] = useState(false);

  const handleAddCourse = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const newCourse: Course = {
      id: courses.length + 1,
      title: formData.get('courseTitle') as string,
      description: formData.get('courseDescription') as string,
      category: formData.get('courseCategory') as string,
      duration: formData.get('courseDuration') as string,
      modules: parseInt(formData.get('moduleCount') as string),
      icon: '📘',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    };
    setCourses([...courses, newCourse]);
    setShowModal(false);
    form.reset();
    alert('Course created successfully! 🎉');
  };

  return (
    <DashboardLayout navVariant="gradient">

      <div className="container">
        <div className="page-header">
          <div>
            <h1>📚 Courses</h1>
            <p className="text-muted">Browse and manage learning courses</p>
          </div>
          {userRole !== 'beneficiary' && (
            <button className="btn btn-primary" onClick={() => setShowModal(true)}>
              ➕ Add New Course
            </button>
          )}
        </div>

        <div className="courses-grid">
          {courses.map((course) => (
            <div key={course.id} className="course-card" onClick={() => window.location.href = `/contents?courseId=${course.id}`}>
              <div className="course-thumbnail" style={{ background: course.gradient }}>
                {course.icon}
                <span className="course-category">{course.category}</span>
              </div>
              <div className="course-content">
                <div className="course-title">{course.title}</div>
                <div className="course-description">{course.description}</div>
                <div className="course-meta">
                  <div className="course-meta-item">⏱️ {course.duration}</div>
                  <div className="course-meta-item">📚 {course.modules} Modules</div>
                </div>
                <div className="course-footer">
                  <span className="course-modules">View Modules →</span>
                  <button className="btn btn-sm btn-primary">Start</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add New Course" size="lg"
        footer={<>
          <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
          <button className="btn btn-success" onClick={() => (document.getElementById('addCourseForm') as HTMLFormElement)?.requestSubmit()}>✅ Submit</button>
        </>}
      >
        <form id="addCourseForm" onSubmit={handleAddCourse}>
          <div className="form-group">
            <label className="form-label form-label-required" htmlFor="courseTitle">Course Title</label>
            <input type="text" id="courseTitle" name="courseTitle" className="form-input" placeholder="e.g., Digital Financial Literacy" required />
          </div>
          <div className="form-group">
            <label className="form-label form-label-required" htmlFor="courseDescription">Description</label>
            <textarea id="courseDescription" name="courseDescription" className="form-textarea" rows={3} placeholder="Describe what learners will gain..." required></textarea>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label form-label-required" htmlFor="courseCategory">Category</label>
              <select id="courseCategory" name="courseCategory" className="form-select" required>
                <option value="">Select Category</option>
                <option value="Financial Literacy">Financial Literacy</option>
                <option value="Digital Skills">Digital Skills</option>
                <option value="Business">Business</option>
                <option value="Health">Health &amp; Safety</option>
                <option value="Agriculture">Agriculture</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label form-label-required" htmlFor="courseDuration">Total Duration</label>
              <input type="text" id="courseDuration" name="courseDuration" className="form-input" placeholder="e.g., 4 hours 30 min" required />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label form-label-required" htmlFor="moduleCount">Number of Modules</label>
              <input type="number" id="moduleCount" name="moduleCount" className="form-input" min={1} placeholder="e.g., 5" required />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="courseThumbnail">Thumbnail Image</label>
              <input type="file" id="courseThumbnail" className="form-input" accept="image/*" />
            </div>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
}
