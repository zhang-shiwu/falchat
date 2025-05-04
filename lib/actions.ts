"use server"

export async function processMessage(message: string): Promise<string> {
  // This is a simplified example. In a real application, you might:
  // 1. Call an AI API like OpenAI
  // 2. Process the message with your own logic
  // 3. Store messages in a database

  // For demo purposes, we'll just check if the message contains HTML-related keywords
  // and respond with appropriate examples

  await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate network delay

  if (message.toLowerCase().includes("html")) {
    return `Here's an example of HTML code you can preview:\n\n\`\`\`html\n<div style="padding: 20px; background-color: #f0f0f0; border-radius: 8px;">\n  <h2 style="color: #333;">HTML Preview Example</h2>\n  <p style="margin-top: 10px; color: #666;">This is rendered HTML content from a code block.</p>\n  <button style="margin-top: 15px; padding: 8px 16px; background-color: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer;">Click Me</button>\n</div>\n\`\`\``
  } else if (message.toLowerCase().includes("button")) {
    return `Here's a button example in HTML:\n\n\`\`\`html\n<button style="padding: 10px 20px; background-color: #007bff; color: white; border: none; border-radius: 4px; font-size: 16px; cursor: pointer;">Click Me</button>\n\`\`\``
  } else if (message.toLowerCase().includes("table")) {
    return `Here's a table example in HTML:\n\n\`\`\`html\n<table style="border-collapse: collapse; width: 100%;">\n  <thead>\n    <tr style="background-color: #f2f2f2;">\n      <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Name</th>\n      <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Email</th>\n      <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Country</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td style="border: 1px solid #ddd; padding: 8px;">John Doe</td>\n      <td style="border: 1px solid #ddd; padding: 8px;">john@example.com</td>\n      <td style="border: 1px solid #ddd; padding: 8px;">USA</td>\n    </tr>\n    <tr style="background-color: #f2f2f2;">\n      <td style="border: 1px solid #ddd; padding: 8px;">Jane Smith</td>\n      <td style="border: 1px solid #ddd; padding: 8px;">jane@example.com</td>\n      <td style="border: 1px solid #ddd; padding: 8px;">Canada</td>\n    </tr>\n  </tbody>\n</table>\n\`\`\``
  } else if (message.toLowerCase().includes("card") || message.toLowerCase().includes("box")) {
    return `Here's a card component example in HTML:\n\n\`\`\`html\n<div style="max-width: 300px; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">\n  <img src="https://via.placeholder.com/300x150" style="width: 100%; display: block;">\n  <div style="padding: 16px;">\n    <h3 style="margin-top: 0; color: #333; font-size: 18px;">Card Title</h3>\n    <p style="color: #666; font-size: 14px;">This is some description text for this card component example.</p>\n    <button style="background-color: #ff5722; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-size: 14px;">Read More</button>\n  </div>\n</div>\n\`\`\``
  } else if (message.toLowerCase().includes("form")) {
    return `Here's a form example in HTML:\n\n\`\`\`html\n<form style="max-width: 400px; padding: 20px; background-color: #f9f9f9; border-radius: 8px;">\n  <div style="margin-bottom: 15px;">\n    <label for="name" style="display: block; margin-bottom: 5px; font-weight: bold;">Name:</label>\n    <input type="text" id="name" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">\n  </div>\n  <div style="margin-bottom: 15px;">\n    <label for="email" style="display: block; margin-bottom: 5px; font-weight: bold;">Email:</label>\n    <input type="email" id="email" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">\n  </div>\n  <div style="margin-bottom: 15px;">\n    <label for="message" style="display: block; margin-bottom: 5px; font-weight: bold;">Message:</label>\n    <textarea id="message" rows="4" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;"></textarea>\n  </div>\n  <button type="submit" style="background-color: #4CAF50; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer;">Submit</button>\n</form>\n\`\`\``
  } else {
    return `You can test the HTML preview feature by asking me about specific HTML elements like buttons, tables, cards, or forms. I'll provide example code that you can preview in the chat.\n\nFor example, try asking:\n- "Show me an HTML button"\n- "Can you create an HTML table?"\n- "I need a card component in HTML"`
  }
}
