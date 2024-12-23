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
        self.page.goto("http://103.56.158.135:5173/login")
        self.page.fill("input[placeholder='Username']", username)
        self.page.fill("input[placeholder='Password']", password)
        self.page.click("button[type='submit']")

    def test_hr_create_job(self):
        """Test creating jobs"""
        self.login('lan.nguyen', '123456')

        # Calculate dates
        today = datetime.now()
        start_date = (today + timedelta(days=1)).strftime("%Y-%m-%d")
        end_date = (today + timedelta(days=30)).strftime("%Y-%m-%d")

        job_data = [
            {
                "title": "Senior Backend Developer",
                "department": "IT",
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
                benefits_input = "[data-testid='select-job-benefits'] .ant-select-selection-search-input"
                for benefit in job_data["benefits"]:
                    self.page.click(benefits_input, timeout=1000)  # Click để mở dropdown
                    self.page.fill(benefits_input, benefit, timeout=1000)  # Fill giá trị
                    self.page.keyboard.press("Enter")  # Press Enter để chọn

                # Select Level
                self.page.click("form div.ant-form-item:has(> div label:text('Level')) .ant-select-selector")
                for level in job_data["level"]:
                    self.page.click(f"div[title='{level}']")
                self.page.keyboard.press("Escape")

                # Select Status
                self.page.click("form div.ant-form-item:has(> div label:text('Status')) .ant-select-selector")
                self.page.click(f"div[title='{job_data['status']}']")

                # Fill Working Address
                self.page.fill("form div.ant-form-item:has(> div label:text('Address')) input",
                               job_data["working_address"])

                # Select Department
                self.page.click("form div.ant-form-item:has(> div label:text('Department')) .ant-select-selector")
                self.page.click(f"div[title='{job_data['department']}']")

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

            print("\n🎉 All jobs created successfully 🎉")

        except Exception as e:
            print(f"\n❌ Test failed: {e}")
            raise
