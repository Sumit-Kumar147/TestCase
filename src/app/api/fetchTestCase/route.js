import axios from 'axios';

export async function POST(req) {
  try {
    const { question, timeConstraints, inputFormat } = await req.json();

    // Update the prompt to reflect the new format
    const prompt = `
      Question: ${question}
      Time Constraints: ${timeConstraints}
      Input Format: ${inputFormat}

      Only Generate test cases for this question. Format them clearly:
      - The response should include:
        - noOfTestCases: the number of test cases
        - TestCases: an array of arrays, each array representing a test case with its inputs on separate lines.
    `;

    // Make a request to Gemini API
    console.log("api key: ", process.env.GEMINI_API_KEY);
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    // console.log("response from Gemini AI:", response.data.candidates[0].content.parts[0].text);

    // Assuming the response from Gemini API will be formatted correctly
    const geminiResponse = response.data.candidates[0].content.parts[0].text;
    // const textResponse = response.data.candidates[0].content.parts[0].text;

    // // Parsing the JSON string inside the text response
    // const parsedData = JSON.parse(textResponse);

    // // Now you can extract the required fields
    // const noOfTestCases = parsedData.noOfTestCases;
    // const testCases = parsedData.TestCases;

    // console.log("noOfTestCases: ", noOfTestCases);
    // console.log("testCases: ",testCases);
    // Parse the Gemini response to extract test cases and the number of test cases
    console.log("res_ai",geminiResponse);
    const parsedResponse = geminiResponse
  .replace(/```json/g, '') // Remove starting ```json
  .replace(/```/g, '')     // Remove ending ```
  .trim();

    return new Response(JSON.stringify(parsedResponse), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error generating test cases:', error);
    return new Response(JSON.stringify({ error: 'Failed to generate test cases' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

// Helper function to parse the response from Gemini API
function parseGeminiResponse(responseText) {
  try {
    // Assuming the response is formatted correctly, extract the necessary data
    const lines = responseText.split("\n").filter(line => line.trim() !== "");
    
    let noOfTestCases = 0;
    let testCases = [];

    // Loop through the lines to parse the test cases
    lines.forEach(line => {
      // Example logic to parse each test case (you may need to adjust based on actual response format)
      if (line.startsWith("Test Case")) {
        noOfTestCases++;
        testCases.push([]);
      } else {
        // Add the current line to the last test case
        if (testCases.length > 0) {
          testCases[testCases.length - 1].push(line.trim());
        }
      }
    });

    console.log("No: ",noOfTestCases);
    console.log("Tests: ", testCases);
    return {
      noOfTestCases,
      TestCases: testCases,
    };
  } catch (error) {
    console.error('Error parsing Gemini response:', error);
    return { noOfTestCases: 0, TestCases: [] };
  }
}
