from playwright.sync_api import sync_playwright, expect
import time
import psycopg2
from psycopg2 import Error
from datetime import datetime, timedelta


class TestJob:
    @classmethod
    def setup_class(cls):
        """Setup test environment and database connection"""
        playwright = sync_playwright().start()
        cls.browser = playwright.chromium.launch(headless=False)
        cls.context = cls.browser.new_context()
        cls.page = cls.context.new_page()

        try:
            cls.db_params = {
                "host": "103.56.158.135", 
                "database": "interview_management",
                "user": "postgres",
                "password": "woskxn"
            }
            cls.conn = psycopg2.connect(**cls.db_params)
            cls.cursor = cls.conn.cursor()
            print("PostgreSQL connection established")
        except (Exception, Error) as error:
            print(f"Error connecting to PostgreSQL: {error}")

    @classmethod
    def teardown_class(cls):
        """Cleanup test data and close connections"""
        try:
            if cls.conn:
                # Delete test jobs based on titles and departments
                delete_jobs_query = """
                    DELETE FROM public.job 
                    WHERE title IN ('Senior Backend Developer', 'Marketing Manager')
                    AND department IN ('IT', 'Marketing')
                """
                cls.cursor.execute(delete_jobs_query)
                cls.conn.commit()
                print("Test jobs deleted successfully")

                # Verify deletion
                verify_query = """
                    SELECT title FROM public.job 
                    WHERE title IN ('Senior Backend Developer', 'Marketing Manager')
                """
                cls.cursor.execute(verify_query)
                remaining = cls.cursor.fetchall()
                if not remaining:
                    print("All test jobs successfully removed")
                else:
                    print(f"Some test jobs remain: {remaining}")

                cls.cursor.close()
                cls.conn.close()
                print("PostgreSQL connection closed")
        except Exception as e:
            print(f"Cleanup error: {str(e)}")
        finally:
            cls.context.close()
            cls.browser.close()

    def login(self, username='admin', password='123123'):
        """Login to application"""
        # self.page.goto("http://localhost:5173/login")
        self.page.goto("http://103.56.158.135:5173/login")
        self.page.fill("input[placeholder='Username']", username)
        self.page.fill("input[placeholder='Password']", password)
        self.page.click("button[type='submit']")

    def verify_job_in_db(self, job_data):
        """Verify job data in database"""
        try:
            # Add delay to ensure data is saved
            time.sleep(2)

            # Query để kiểm tra job trong database
            verify_query = """
                SELECT 
                    j.title,
                    j.department,
                    j.position,
                    j.skills,
                    j.start_date,
                    j.end_date,
                    j.salary_from,
                    j.salary_to,
                    j.level,
                    j.status,
                    j.description
                FROM public.job j
                WHERE j.title = %s
                AND j.department = %s
                ORDER BY j.created_date DESC
                LIMIT 1
            """

            self.cursor.execute(verify_query, (
                job_data["title"],
                job_data["department"]
            ))

            result = self.cursor.fetchone()
            assert result is not None, f"Job {job_data['title']} not found in database"

            # Unpack database results
            (db_title, db_department, db_position, db_skills,
             db_start_date, db_end_date, db_salary_from, db_salary_to,
             db_level_str, db_status, db_description) = result
            db_level_list = db_level_str.strip('{}').split(',')  # Convert '{Senior,Leader}' to ['Senior', 'Leader']
            db_level = set(db_level_list)


            # Verify essential fields
            assert db_title == job_data["title"], \
                f"Title mismatch: {db_title} != {job_data['title']}"

            assert db_department == job_data["department"], \
                f"Department mismatch: {db_department} != {job_data['department']}"

            assert db_position == job_data["position"], \
                f"Position mismatch: {db_position} != {job_data['position']}"

            # Verify arrays (skills và level được lưu dưới dạng array trong PostgreSQL)
            db_skills_set = set(db_skills) if db_skills else set()
            expected_skills_set = set(job_data["skills"])
            assert db_skills_set == expected_skills_set, \
                f"Skills mismatch: {db_skills_set} != {expected_skills_set}"

            db_level_set = set(db_level) if db_level else set()
            expected_level_set = set(job_data["level"])
            assert db_level_set == expected_level_set, \
                f"Level mismatch: {db_level_set} != {expected_level_set}"

            # Verify dates
            db_start = db_start_date.strftime("%Y-%m-%d")
            assert db_start == job_data["start_date"], \
                f"Start date mismatch: {db_start} != {job_data['start_date']}"

            db_end = db_end_date.strftime("%Y-%m-%d")
            assert db_end == job_data["end_date"], \
                f"End date mismatch: {db_end} != {job_data['end_date']}"

            # Verify numeric fields
            assert float(db_salary_from) == float(job_data["salary_from"]), \
                f"Salary from mismatch: {db_salary_from} != {job_data['salary_from']}"

            assert float(db_salary_to) == float(job_data["salary_to"]), \
                f"Salary to mismatch: {db_salary_to} != {job_data['salary_to']}"

            # Verify status and description
            assert db_status == job_data["status"], \
                f"Status mismatch: {db_status} != {job_data['status']}"

            assert db_description == job_data["description"], \
                f"Description mismatch: {db_description} != {job_data['description']}"

            print(f"✓ Verified job in database: {job_data['title']}")
            return True

        except AssertionError as ae:
            print(f"❌ Verification failed: {str(ae)}")
            raise
        except Exception as e:
            print(f"❌ Database verification error: {str(e)}")
            raise

    def test_hr_create_job(self):
        """Test creating jobs"""
        self.login()

        # Calculate dates
        today = datetime.now()
        start_date = (today + timedelta(days=1)).strftime("%Y-%m-%d")
        end_date = (today + timedelta(days=30)).strftime("%Y-%m-%d")

        job_data = [
            {
                "title": "Senior Backend Developer",
                "department": "IT",
                "position": "Frontend Developer",
                "skills": ["Node.js", "Python", "PostgreSQL"],
                "start_date": start_date,
                "end_date": end_date,
                "salary_from": "2000",
                "salary_to": "4000",
                "currency": "USD",
                "benefits": ["Insurance", "Remote Working"],
                "level": ["Senior", "Leader"],
                "status": "Open",
                "working_address": "123 Nguyen Van Linh, Ha Noi",
                "description": "Looking for experienced backend developer"
            },
            {
                "title": "Marketing Manager",
                "department": "Marketing",
                "position": "Business Executive",
                "skills": ["Digital Marketing", "Content Strategy"],
                "start_date": start_date,
                "end_date": end_date,
                "salary_from": "1500",
                "salary_to": "3000",
                "currency": "USD",
                "benefits": ["Insurance", "Flexible Hours"],
                "level": ["Mentor"],
                "status": "Open",
                "working_address": "456 Nguyen Van Linh, Ha Noi",
                "description": "Seeking marketing manager with digital experience"
            }
        ]

        def fill_job_form(job_data):
            try:
                # Click Add Job button
                self.page.click("text='Add Job'")
                self.page.click("form div.ant-form-item:has(> div label:text('Department')) .ant-select-selector")
                self.page.click(f"div[title='{job_data['department']}']")
                self.page.click("[data-testid='select-job-position']")
                self.page.click(f"div[title='{job_data['position']}']")
                # Fill Job Title
                self.page.fill("input[placeholder='Enter job title']", job_data["title"])

                # Add Skills
                # Add Skills
                for skill in job_data["skills"]:
                    self.page.click("[data-testid='select-job-skills']")
                    # Sử dụng data-testid để target chính xác input field
                    skills_input = "[data-testid='select-job-skills'] .ant-select-selection-search-input"
                    self.page.fill(skills_input, skill)
                    self.page.keyboard.press("Enter")
                    self.page.wait_for_timeout(500)  # Wait for animation

                # Set Start Date
                self.page.click("[data-testid='date-job-start']", timeout=1000)
                self.page.fill("input[placeholder='Select date']", job_data["start_date"])
                self.page.click("[data-testid='date-job-start']")

                # # Click away to close datepicker
                self.page.click("text='ADD JOB'")

                # Set End Date
                self.page.click("[data-testid='date-job-end']", timeout=1000)
                self.page.fill("#layout-multiple-horizontal_end_date", job_data["end_date"], timeout=1000)

                # Fill Salary Range
                self.page.fill(
                    "form div.ant-form-item:has(> div label:text('Salary from')) input.ant-input-number-input",
                    job_data["salary_from"])
                self.page.fill("form div.ant-form-item:has(> div label:text('Salary to')) input.ant-input-number-input",
                               job_data["salary_to"])

                # Add Benefits
                # benefits_input = "#layout-multiple-horizontal_benefits .ant-select-selection-search-input"
                # benefits_input = "[data-testid='select-job-benefits'] .ant-select-selection-search-input"
                # for benefit in job_data["benefits"]:
                #     self.page.click(benefits_input, timeout=1000)  # Click để mở dropdown
                #     self.page.fill(benefits_input, benefit, timeout=1000)  # Fill giá trị
                #     self.page.keyboard.press("Enter")  # Press Enter để chọn

                # Select Level
                self.page.click("form div.ant-form-item:has(> div label:text('Level')) .ant-select-selector")
                for level in job_data["level"]:
                    self.page.click(f"div[title='{level}']")
                self.page.keyboard.press("Escape")

                # Select Status
                self.page.click("form div.ant-form-item:has(> div label:text('Status')) .ant-select-selector")
                self.page.click(f"div[title='{job_data['status']}']")

                # Fill Working Address
                # self.page.fill("form div.ant-form-item:has(> div label:text('Address')) input",
                #                job_data["working_address"])


                # Fill Description
                self.page.fill("form div.ant-form-item:has(> div label:text('Description')) input",
                               job_data["description"])

                # Submit form
                self.page.click("button:text('Submit')")
                print(f"✓ Created job: {job_data['title']}")


            except Exception as e:
                print(f"❌ Error in creating job: {e}")
                raise

        try:
            # Navigate to Job page
            self.page.click("a[href='/job']")
            print("✓ Navigated to Job page")

            # Create each job
            for job in job_data:
                fill_job_form(job)
                self.verify_job_in_db(job)

            print("\n🎉 All jobs created successfully 🎉")

        except Exception as e:
            print(f"\n❌ Test failed: {e}")
            raise
