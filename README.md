# CSP 586 Lab 01

## Goal

Create an environment for LLM Agent Programming.  

> The lab in course is using OpenAI and ChanGraph, but we are using DeepSeek instead > of them, due to the barries in China mainlaind and OpenAI.

## Steps

### Step 01 Create Python Virtual Envrionemnt

1. Download and install `python` and `pip` on MacOS
2. Navigate to lab folder in terminal
3. Create virtual environment for lab.

```python
python3 -m venv venv-deepseek
source venv-deepseek/bin/activate
(venv-deepseek)python3 -m pip install uv 
(venv-deepseek)uv pip install requests openai httpx python-dotenv
```

1. Download lab notebook from course site.
1. Set API Key for environment
1. Open and run the notebook downloaded in step #4.
1. Fix failed codes, such as replace OpenAI with ZhipuAI, since OpenAI cannot be accessed from China.
