from playwright.sync_api import sync_playwright, expect
import time
import psycopg2
from psycopg2 import Error
from datetime import datetime, timedelta



class TestRequest:
    @classmethod
    def setup_class(cls):
        """Setup test environment and database connection"""
        # Start Playwright
        playwright = sync_playwright().start()
        cls.browser = playwright.chromium.launch(headless=False)
        cls.context = cls.browser.new_context()
        cls.page = cls.context.new_page()

        try:
            # PostgreSQL connection
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
                # Delete test requests
                delete_requests_query = """
                       DELETE FROM public."request"
                       WHERE position IN ('Frontend Developer', 'Backend Developer')
                       AND created_by IN (5)
                   """
                cls.cursor.execute(delete_requests_query)
                cls.conn.commit()
                print("Test requests deleted successfully")

                # Verify deletion
                verify_query = """
                       SELECT position, workplace FROM public."request" 
                       WHERE position IN ('Frontend Developer', 'Backend Developer')
                       AND workplace IN ('Ha Noi', 'Ho Chi Minh')
                       AND level IN ('Junior', 'Middle')
                       AND created_by IN (5)
                   """
                cls.cursor.execute(verify_query)
                remaining = cls.cursor.fetchall()
                if not remaining:
                    print("All test requests successfully removed")
                else:
                    print(f"Some test requests remain: {remaining}")

                # Close database connection
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
        # time.sleep(3)
        self.page.goto("http://103.56.158.135:5173/login")

        # Fill login form
        self.page.fill("input[placeholder='Username']", username)
        self.page.fill("input[placeholder='Password']", password)

        # Click login button
        self.page.click("button[type='submit']")

    def logout(self):
        self.page.click(".ant-dropdown-trigger")
        self.page.click(".ant-dropdown-menu-item:last-child")

    def verify_request_in_db(self, request_data):
        """Verify request data in database"""
        try:
            verify_query = """
                SELECT 
                    position,
                    quantity,
                    start_date,
                    end_date,
                    workplace,
                    level,
                    description,
                    status
                FROM public."request"
                WHERE position = %s
                AND workplace = %s
                AND level && %s  # Sử dụng && cho array intersection
            """

            self.cursor.execute(verify_query, (
                request_data["position"],
                request_data["workplace"],
                request_data["level"]
            ))

            result = self.cursor.fetchone()
            assert result is not None, f"Request for {request_data['position']} not found in database"

            # Verify từng trường
            db_position, db_quantity, db_start_date, db_end_date, db_workplace, db_level, db_description, db_status = result

            assert db_position == request_data[
                "position"], f"Position mismatch: {db_position} != {request_data['position']}"
            assert int(db_quantity) == int(
                request_data["quantity"]), f"Quantity mismatch: {db_quantity} != {request_data['quantity']}"
            assert str(db_workplace) == request_data[
                "workplace"], f"Workplace mismatch: {db_workplace} != {request_data['workplace']}"

            # Convert and compare dates
            expected_start = datetime.strptime(request_data["start_date"], '%d/%m/%Y').date()
            expected_end = datetime.strptime(request_data["end_date"], '%d/%m/%Y').date()
            assert db_start_date == expected_start, f"Start date mismatch: {db_start_date} != {expected_start}"
            assert db_end_date == expected_end, f"End date mismatch: {db_end_date} != {expected_end}"

            # Verify level array contains all required levels
            for level in request_data["level"]:
                assert level in db_level, f"Level {level} not found in {db_level}"

            # Verify description if provided
            if "description" in request_data:
                assert db_description == request_data[
                    "description"], f"Description mismatch: {db_description} != {request_data['description']}"

            print(f"✓ Verified request in database: {request_data['position']}")
            return True

        except AssertionError as ae:
            print(f"❌ Verification failed: {str(ae)}")
            raise
        except Exception as e:
            print(f"❌ Database verification error: {str(e)}")
            raise

    def test_od_create_request(self):
        """Test creating recruitment requests"""
        self.login('itmanager', '123456')
        current_date = datetime.now()
        # Lấy ngày 1 tháng sau
        next_month = current_date + timedelta(days=30)
        current_date_str = current_date.strftime('%d/%m/%Y')
        next_month_str = next_month.strftime('%d/%m/%Y')

        test_requests = [
            {
                "position": "Frontend Developer",
                "quantity": "2",
                "start_date": current_date_str,
                "end_date": next_month_str,
                "workplace": "Ha Noi",
                "level": ["Junior", "Middle"],
                "description": "Looking for Frontend Developers with React experience"
            },
            {
                "position": "Backend Developer",
                "quantity": "1",
                "start_date": current_date_str,
                "end_date": next_month_str,
                "workplace": "Ho Chi Minh",
                "level": ["Senior"],
                "description": "Looking for a Senior Backend Developer with Node.js and database expertise"
            }
        ]

        def fill_request_form(request_data):
            try:

                # Click Add Request button
                self.page.click("text='New Recruitment Request'")

                # Fill Position
                self.page.click("[data-testid='select-request-position']")
                self.page.click(f"div[title='{request_data['position']}']")

                # Fill Quantity
                self.page.fill("input[placeholder='Enter number of positions']", request_data["quantity"])

                # Fill Date Range
                self.page.click(".ant-picker-range")
                self.page.fill("input[placeholder='Start date']", request_data["start_date"])
                self.page.fill("input[placeholder='End date']", request_data["end_date"])

                # Click empty space
                self.page.click("text='NEW RECRUITMENT REQUEST'", timeout=2000)

                # Select Workplace
                self.page.click("[data-testid='select-request-workplace']")
                self.page.click(f"div.ant-select-item-option[title='{request_data['workplace']}']")

                # Select Levels
                self.page.click(
                    ".ant-select-outlined.ant-select-in-form-item.css-dev-only-do-not-override-98ntnt.ant-select-multiple")

                for level in request_data["level"]:
                    self.page.click(f"div.ant-select-item[title='{level}']")

                # Fill Description
                self.page.fill("textarea[placeholder='Enter request description (optional)']",
                               request_data["description"])

                # Submit form
                self.page.click("button:text('Submit')")
                print("✓ Form submitted")

                # Wait for submission
                print("Waiting for submission to process...")
                self.page.wait_for_timeout(1000)
                print("✓ Submission completed")

            except Exception as e:
                print(f"❌ Error in creating request: {e}")
                raise

        try:
            self.page.click("a[href='/request']")
            print("✓ Navigated to Request page")

            # Create each request
            for request_data in test_requests:
                fill_request_form(request_data)
                self.verify_request_in_db(request_data)

            print("\n🎉 All recruitment requests created successfully 🎉")

        except Exception as e:
            print(f"\n❌ Test failed: {e}")
            raise

    def test_hr_opera_request(self):
        """Test HR operations on requests (approve/reject)"""
        self.logout()
        self.login('hr', '123456')

        try:

            # Navigate to Request page
            self.page.click("a[href='/request']")
            print("✓ Navigated to Request page")

            # Wait for table to load
            self.page.wait_for_selector(".ant-table-tbody")

            # Process Frontend Developer request - Approve
            try:
                # Find the row with Frontend Developer
                frontend_row = self.page.locator("tr", has_text="Frontend Developer").first
                select = frontend_row.locator("div.ant-select-selector").first
                select.click()

                self.page.click('div[title="Approve"]')

                # Wait for status update
                self.page.wait_for_timeout(1000)

            except Exception as e:
                print(f"❌ Error processing Frontend Developer request: {e}")

            # Process Backend Developer request - Reject
            print("\nProcessing Backend Developer request...")
            try:
                # Find the row with Backend Developer
                backend_row = self.page.locator("tr", has_text="Backend Developer").first
                select = backend_row.locator("div.ant-select-selector").first
                select.click()

                self.page.click('div[title="Reject"]')
                print("✓ Rejected Backend Developer request")

                # Wait for status update
                self.page.wait_for_timeout(1000)

            except Exception as e:
                print(f"❌ Error processing Backend Developer request: {e}")

            print("\n🎉 HR operations completed successfully 🎉")

            # Verify statuses
            try:

                # Verify Frontend Developer status
                frontend_status = self.page.get_by_text("Frontend Developer").locator(
                    'xpath=../../..//span[contains(@class, "bg-green")]')
                expect(frontend_status).to_contain_text("Approved")
                print("✓ Frontend Developer status verified as Approved")

                # Verify Backend Developer status
                backend_status = self.page.get_by_text("Backend Developer").locator(
                    'xpath=../../..//span[contains(@class, "bg-red")]')
                expect(backend_status).to_contain_text("Rejected")
                print("✓ Backend Developer status verified as Rejected")

            except Exception as e:
                print(f"❌ Error verifying statuses: {e}")
                raise

        except Exception as e:
            print(f"\n❌ HR operations test failed: {e}")
            raise

