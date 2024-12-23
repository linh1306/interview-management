from playwright.sync_api import sync_playwright, expect
import time
import psycopg2
from psycopg2 import Error
from datetime import datetime, timedelta


class TestOffer:
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
                # Delete test offers based on candidates
                delete_offers_query = """
                    DELETE FROM public.offer 
                    WHERE candidate_id IN (
                        SELECT id FROM public.candidate 
                        WHERE email IN ('john.doe@test.com', 'jane.smith@test.com')
                    )
                """
                cls.cursor.execute(delete_offers_query)
                cls.conn.commit()
                print("Test offers rollback successfully")

                # Verify deletion
                verify_query = """
                    SELECT o.* FROM public.offer o
                    JOIN public.candidate c ON o.candidate_id = c.id
                    WHERE c.email IN ('john.doe@test.com', 'jane.smith@test.com')
                """
                cls.cursor.execute(verify_query)
                remaining = cls.cursor.fetchall()
                if not remaining:
                    print("All test offers successfully removed")
                else:
                    print(f"Some test offers remain: {remaining}")

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
        # self.page.goto("http://localhost:5173/login")
        self.page.fill("input[placeholder='Username']", username)
        self.page.fill("input[placeholder='Password']", password)
        self.page.click("button[type='submit']")

    def test_hr_create_offer(self):
        """Test creating offers"""
        self.login('lan.nguyen', '123456')

        # Calculate dates
        today = datetime.now()
        contract_from = (today + timedelta(days=1)).strftime("%Y-%m-%d")
        contract_to = (today + timedelta(days=365)).strftime("%Y-%m-%d")  # 1 year contract

        offer_data = [
            {
                "candidate_id": "John Doe",
                "department": "IT",
                "interview_schedule_id": "Technical Interview Round 2",
                "position": "Backend Developer",
                "manager_id": "lan.nguyen",  # The HR approver
                "status": "Approved offer",
                "level": "Leader",
                "contract_type": "One Year",
                "contract_from": contract_from,
                "contract_to": contract_to,
                "basic_salary": "2000",
                "currency": "USD",
                "note": "IT Department offer with competitive package"
            },
            {
                "candidate_id": "Jane Smith",
                "department": "Marketing",
                "interview_schedule_id": "Marketing Interview Round 1",
                "position": "Bussiness Analyst",
                "manager_id": "lan.nguyen",  # The HR approver
                "status": "Approved offer",
                "level": "Manager",
                "contract_type": "Three years",
                "contract_from": contract_from,
                "contract_to": contract_to,
                "basic_salary": "1800",
                "currency": "USD",
                "note": "Marketing Department offer with benefits"
            }
        ]

        def fill_offer_form(offer_data):
            try:
                # Click Add Offer button
                self.page.click("text='Add Offer'")

                # Select Candidate
                self.page.click("[data-testid='select-offer-candidate']")
                self.page.click(f"div[title^='{offer_data['candidate_id']}']")

                # Select Department
                self.page.click("[data-testid='select-offer-department']")
                self.page.click(f"div[title='{offer_data['department']}']")

                # Select Interview Schedule
                self.page.click("[data-testid='select-offer-interview']")
                self.page.click(f"div[title='{offer_data['interview_schedule_id']}']")

                # Select Position
                self.page.click("[data-testid='select-offer-position']")
                self.page.click(f"div[title='{offer_data['position']}']")

                # Select Manager/Approver
                self.page.click("[data-testid='select-offer-approver']")
                self.page.click(f"div[title='{offer_data['manager_id']}']")

                # Select Status
                self.page.click("[data-testid='select-offer-status']")
                self.page.click(f"div[title='{offer_data['status']}']")

                # Select Level
                self.page.click("[data-testid='select-offer-level']")
                self.page.click(f"div[title='{offer_data['level']}']")

                # Select Contract Type
                self.page.click("[data-testid='select-offer-contract']")
                self.page.click(f"div[title='{offer_data['contract_type']}']")

                # Set Contract From Date
                self.page.click("[data-testid='select-offer-from']")
                self.page.fill("#layout-multiple-horizontal_contract_from", offer_data["contract_from"], timeout=1000)
                self.page.click("text='ADD OFFER'")

                # Set Contract To Date
                self.page.click("[data-testid='select-offer-to']")
                self.page.fill("#layout-multiple-horizontal_contract_to", offer_data["contract_to"], timeout=1000)
                self.page.click("text='ADD OFFER'")

                # Fill Basic Salary
                self.page.fill("[data-testid='input-offer-salary']", offer_data["basic_salary"], timeout=1000)

                # Fill Note
                self.page.fill("[data-testid='input-offer-note']", offer_data["note"], timeout=1000)

                # Submit form
                self.page.click("button:text('Submit')")
                print(f"✓ Created offer for: {offer_data['candidate_id']}")

                # Wait for submission
                self.page.wait_for_timeout(1000)

            except Exception as e:
                print(f"❌ Error in creating offer: {e}")
                raise

        try:
            # Navigate to Offer page
            self.page.click("a[href='/offer']")
            print("✓ Navigated to Offer page")

            # Create each offer
            for offer in offer_data:
                fill_offer_form(offer)

            print("\n🎉 All offers created successfully 🎉")

        except Exception as e:
            print(f"\n❌ Test failed: {e}")
            raise
