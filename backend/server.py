from flask import Flask

app = Flask(__name__)

# Test route
@app.route('/test')
def test():
  return 'Test Response';

if __name__ == '__main__':
  app.run(debug=True)