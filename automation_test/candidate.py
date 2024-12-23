from playwright.sync_api import sync_playwright, expect
import time
import psycopg2
from psycopg2 import Error
from datetime import datetime


class TestCandidate:
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
                # Delete test candidates
                delete_candidates_query = """
                    DELETE FROM public.candidate 
                    WHERE email IN ('john.binson@test.com', 'taylor.smith@test.com')
                """
                cls.cursor.execute(delete_candidates_query)
                cls.conn.commit()
                print("Test candidates deleted successfully")

                # Verify deletion
                verify_query = """
                    SELECT full_name, email FROM public.candidate 
                    WHERE email IN ('john.binson@test.com', 'taylor.smith@test.com')
                """
                cls.cursor.execute(verify_query)
                remaining = cls.cursor.fetchall()
                if not remaining:
                    print("All test candidates successfully removed")
                else:
                    print(f"Some test candidates remain: {remaining}")

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

    def test_hr_create_candidate(self):
        """Test creating candidates"""
        self.login('lan.nguyen', '123456')

        candidate_data = [
            {
                "full_name": "John Doe",
                "email": "john.binson@test.com",
                "phone": "0123456781",
                "dob": "1990-01-01",
                "address": "123 Nguyễn Văn Linh, Hà Nội",
                "gender": "Male",
                "position": "Fullstack Developer",
                "status": "Waiting for interview",
                "skills": ["React", "Node.js"],
                "highest_level": "Master Degree",
                "year_experience": "3",
                "department": "IT",
                "note": "Strong technical background"
            },
            {
                "full_name": "Jane Smith",
                "email": "taylor.smith@test.com",
                "phone": "0987654319",
                "dob": "1992-05-15",
                "address": "456 Nguyễn Văn Linh, Hà Nội",
                "gender": "Female",
                "position": "Bussiness Analyst",
                "status": "Open",
                "skills": ["Content Marketing", "Social Media Marketing"],
                "highest_level": "PhD",
                "year_experience": "3",
                "department": "Marketing",
                "note": "Experienced in digital marketing campaigns and content strategy"
            }
        ]

        def fill_candidate_form(candidate_data):
            try:
                # Click Add Candidate button
                self.page.click("text='Add Candidate'")

                # Fill Personal Information
                self.page.fill("input[placeholder='Enter full name']", candidate_data["full_name"])
                self.page.fill("input[placeholder='Enter email']", candidate_data["email"])
                self.page.fill("input[placeholder='Enter full phone no']", candidate_data["phone"])

                # Set Date of Birth
                self.page.click(".ant-picker")
                self.page.fill("input[placeholder='Select date']", candidate_data["dob"])
                self.page.click("text='I. Personal information'")  # Click away to close datepicker

                self.page.fill("input[placeholder='Enter address']", candidate_data["address"])

                # Select Gender
                gender_selector = ".ant-select-outlined.ant-select-in-form-item"
                self.page.click(gender_selector, timeout=2000)
                self.page.click(f"div[title='{candidate_data['gender']}']")

                # Fill Professional Information
                self.page.click('[data-testid="select-position"]', timeout=2000)
                self.page.click(f"div[title='{candidate_data['position']}']")

                self.page.click('[data-testid="select-status"]', timeout=2000)
                self.page.click(f"div[title='{candidate_data['status']}']")

                # Add Skills
                skills_input = f'[data-testid="select-skills"] .ant-select-selection-search-input'
                for skill in candidate_data["skills"]:
                    self.page.click(f'[data-testid="select-skills"]')  # Click vào select để mở dropdown
                    self.page.fill(skills_input, skill)  # Điền skill
                    self.page.keyboard.press("Enter")  # Press Enter để thêm skill
                    self.page.wait_for_timeout(500)  # Đợi animation hoàn thành

                # Select Highest Level
                self.page.click('[data-testid="select-highest-level"]', timeout=2000)
                self.page.click(f"div[title='{candidate_data['highest_level']}']")

                # Fill Experience
                self.page.fill("input[placeholder='Enter experience']", candidate_data["year_experience"])

                # Select Department

                self.page.click('[data-testid="select-department"]', timeout=2000)
                self.page.click(f"div[title='{candidate_data['department']}']")

                # Fill Note
                self.page.fill("input[placeholder='Enter note']", candidate_data["note"])

                # Submit form
                self.page.click("button:text('Submit')")
                print(f"✓ Created candidate: {candidate_data['full_name']}")

                # Wait for submission
                self.page.wait_for_timeout(1000)

            except Exception as e:
                print(f"❌ Error in creating candidate: {e}")
                raise

        try:
            # Navigate to Candidate page
            self.page.click("a[href='/candidate']")
            print("✓ Navigated to Candidate page")

            # Create each candidate
            for candidate in candidate_data:
                fill_candidate_form(candidate)

            print("\n🎉 All candidates created successfully 🎉")

        except Exception as e:
            print(f"\n❌ Test failed: {e}")
            raise
