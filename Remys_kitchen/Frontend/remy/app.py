from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
import os
import time
from flask_cors import CORS




app = Flask(__name__)

#Cors probléma miatt át kellett alakítanom
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)


BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_FOLDER = os.path.join(BASE_DIR, "public", "asserts", "kepek")
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'image' not in request.files:
        return jsonify({"error": "Nincs fájl a kérésben."}), 400

    file = request.files['image']

    if file.filename == '':
        return jsonify({"error": "Nem választottál fájlt."}), 400

    original_filename = secure_filename(file.filename)
    
    #Egyedi nev generalasa
    timestamp = int(time.time())
    file_extension = os.path.splitext(original_filename)[1]
    unique_filename = f"{timestamp}_{original_filename}"

    file_path = os.path.join(app.config['UPLOAD_FOLDER'], unique_filename)

    try:
        file.save(file_path)
        return jsonify({
            "message": "Fájl sikeresen feltöltve.",
            "file_path": f"/public/asserts/kepek/{unique_filename}"
        }), 200
    except Exception as e:
        return jsonify({"error": f"Hiba a fájl mentése közben: {str(e)}"}), 500


#Ezt az egész részt át kell néznünk, hogy a sulis gépek nehogy sírjanak

@app.route('/delete/<filename>', methods=['DELETE'])
def delete_file(filename):
 
    secured_filename = secure_filename(filename)

    file_path = os.path.join(app.config['UPLOAD_FOLDER'], secured_filename)
    
    #Hibakódok
    if not os.path.exists(file_path):
        return jsonify({"error": "A fájl nem található."}), 404
    
    try:

        os.remove(file_path)
        return jsonify({"message": "Fájl sikeresen törölve."}), 200
    except Exception as e:
        return jsonify({"error": f"Hiba a fájl törlése közben: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(debug=True)