from playwright.sync_api import sync_playwright, expect
import time
import psycopg2
from psycopg2 import Error
from datetime import datetime, timedelta

class TestInterview:
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
                # Delete test interviews based on titles
                delete_interviews_query = """
                    DELETE FROM public.interview_schedule 
                    WHERE title IN ('Technical Interview - John Doe', 'Marketing Interview - Jane Smith')
                """
                cls.cursor.execute(delete_interviews_query)
                cls.conn.commit()
                print("Test interviews rollback successfully")

                # Verify deletion
                verify_query = """
                    SELECT title FROM public.interview_schedule 
                    WHERE title IN ('Technical Interview - John Doe', 'Marketing Interview - Jane Smith')
                """
                cls.cursor.execute(verify_query)
                remaining = cls.cursor.fetchall()
                if not remaining:
                    print("All test interviews successfully removed")
                else:
                    print(f"Some test interviews remain: {remaining}")

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
        self.page.goto("http://localhost:5173/login")
        self.page.fill("input[placeholder='Username']", username)
        self.page.fill("input[placeholder='Password']", password)
        self.page.click("button[type='submit']")

    def test_hr_create_interview(self):
        """Test creating interviews"""
        # self.login('lan.nguyen', '123456')
        self.login()
        # Calculate dates and times
        today = datetime.now()
        interview_date = (today + timedelta(days=1)).strftime("%Y-%m-%d")
        time_from = "09:00:00"
        time_to = "10:00:00"

        interview_data = [
            {
                "title": "Automation Test Interview 1",
                "job_id": "Fresher Frontend Developer",  # Will need to select from dropdown
                "candidate_id": "Hoàng Ngọc Lan (hoangngoclan52@gmail.com)",  # Will need to select from dropdown
                "interviewer_ids": ["itmanager"],  # Will need to select from dropdown
                "schedule_date": interview_date,
                "schedule_time_from": time_from,
                "schedule_time_to": time_to,
                "location": "Meeting Room 1",
                "note": "Technical assessment and culture fit evaluation"
            },
            {
                "title": "Automation Test Interview 2",
                "job_id": "Legal Manager",  # Will need to select from dropdown
                "candidate_id": "Phạm Thị Nhung (phamthinhung10@outlook.com)",  # Will need to select from dropdown
                "interviewer_ids": ["afmanager"],  # Will need to select from dropdown
                # "status": "Open",
                "schedule_date": interview_date,
                "schedule_time_from": time_from,
                "schedule_time_to": time_to,
                "location": "Meeting Room 2",
                "note": "Marketing strategy discussion"
            }
        ]

        def fill_interview_form(interview_data):
            try:
                # Click Add Interview button
                self.page.click("text='Add Interview'")

                # Fill Schedule Title
                self.page.fill("input[placeholder='Enter interview title']", interview_data["title"])

                # Select Job
                self.page.click("[data-testid='select-interview-job']")
                self.page.click(f"div[title='{interview_data['job_id']}']", timeout=2000)

                # Select Candidate
                self.page.click("[data-testid='select-interview-candidate']")
                self.page.click(f"div[title^='{interview_data['candidate_id']}']")

                # # Select Position
                # self.page.click("[data-testid='select-interview-position']")
                # self.page.click(f"div[title='{interview_data['position']}']")

                # Select Interviewers
                self.page.click("[data-testid='select-interview-interviewers']")
                for interviewer in interview_data["interviewer_ids"]:
                    self.page.click(f"div[title='{interviewer}']")
                self.page.keyboard.press("Escape")

                # # Select Status
                # self.page.click("[data-testid='select-interview-status']")
                # self.page.click(f"div[title='{interview_data['status']}']")

                # Set Schedule Date
                self.page.click("[data-testid='date-interview-schedule']")
                self.page.fill("input[placeholder='Select date']", interview_data["schedule_date"])
                self.page.click("text='ADD INTERVIEW SCHEDULE'")

                # Set Time Range
                self.page.click("[data-testid='time-interview-from']")
                self.page.fill("input[placeholder='Select time']", interview_data["schedule_time_from"])
                self.page.click("text='OK'")

                self.page.click("[data-testid='time-interview-to']")
                self.page.fill("#layout-multiple-horizontal_schedule_time_from", interview_data["schedule_time_to"], timeout=1000)
                self.page.click("text='ADD INTERVIEW SCHEDULE'")

                # Fill Location and Note
                self.page.fill("input[placeholder='Enter location']", interview_data["location"])
                self.page.fill("input[placeholder='Enter note']", interview_data["note"])

                # Submit form
                self.page.click("button:text('Submit')")
                print(f"✓ Created interview: {interview_data['title']}")

                # Wait for submission
                self.page.wait_for_timeout(1000)

            except Exception as e:
                print(f"❌ Error in creating interview: {e}")
                raise

        try:
            # Navigate to Interview page
            self.page.click("a[href='/interview']")
            print("✓ Navigated to Interview page")

            # Create each interview
            for interview in interview_data:
                fill_interview_form(interview)

            print("\n🎉 All interviews created successfully 🎉")

        except Exception as e:
            print(f"\n❌ Test failed: {e}")
            raise