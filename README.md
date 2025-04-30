# Bob's Corn Shop

## Instructions

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/yourusername/bobs-corn.git
   cd bobs-corn
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Run the Application**:
   ```bash
   npm run dev
   ```

4. **Usage**:
   - Open your browser at `http://localhost:3000`.
   - A unique client ID will be generated.
   - Click "Buy Corn 🌽" to make a purchase and see your corn count.

## Use Case
This app allows users to track corn purchases using a unique client ID, providing a simple and interactive experience.

## Error Handling
- If a user tries to make a purchase too quickly, the server responds with a **429** status code. The app handles this by displaying a message: "⚠️ Please wait one minute between purchases!" This informs the user to wait before attempting another purchase.
- Other errors are caught and logged, with a generic message shown to the user: "❌ Something went wrong!" or "❌ Error connecting to server!" to ensure they are aware of any issues.
