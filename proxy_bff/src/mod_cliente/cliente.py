from flask import Blueprint, jsonify, request
from settings import API_ENDPOINT_CLIENTE
from funcoes import Funcoes

bp_cliente = Blueprint('cliente', __name__, url_prefix="/api/cliente")

# Rota para Listar todos os Clientes (GET /cliente/)
@bp_cliente.route('/all', methods=['GET'])
def get_clientes():
    response_data, status_code = Funcoes.make_api_request('get', API_ENDPOINT_CLIENTE)
    return jsonify(response_data), status_code

# Rota para Obter um Cliente Específico (GET /cliente/one?id_cliente=123)
@bp_cliente.route('/one', methods=['GET'])
def get_cliente():
    id_cliente = request.args.get('id_cliente')
    if not id_cliente:
        return jsonify({"error": "O parâmetro 'id_cliente' é obrigatório"}), 400
    response_data, status_code = Funcoes.make_api_request('get', f"{API_ENDPOINT_CLIENTE}{id_cliente}")
    return jsonify(response_data), status_code

# Rota para Criar um novo Cliente (POST /cliente/)
@bp_cliente.route('/', methods=['POST'])
def create_cliente():
    if not request.is_json:
        return jsonify({"error": "Requisição deve ser JSON"}), 400
    data = request.get_json()
    required_fields = ['nome', 'cpf', 'telefone']
    if not all(field in data for field in required_fields):
        return jsonify({"error": f"Campos obrigatórios faltando: {required_fields}"}), 400
    response_data, status_code = Funcoes.make_api_request('post', API_ENDPOINT_CLIENTE, data=data)
    return jsonify(response_data), status_code

# Rota para Atualizar um Cliente existente (PUT /cliente/?id_cliente=123)
@bp_cliente.route('/', methods=['PUT'])
def update_cliente():
    id_cliente = request.args.get('id_cliente')
    if not id_cliente:
        return jsonify({"error": "O parâmetro 'id_cliente' é obrigatório"}), 400
    if not request.is_json:
        return jsonify({"error": "Requisição deve ser JSON"}), 400
    data = request.get_json()
    required_fields = ['nome', 'cpf', 'telefone']
    if not all(field in data for field in required_fields):
        return jsonify({"error": f"Campos obrigatórios faltando: {required_fields}"}), 400
    data['id_cliente'] = id_cliente
    response_data, status_code = Funcoes.make_api_request('put', f"{API_ENDPOINT_CLIENTE}{id_cliente}", data=data)
    return jsonify(response_data), status_code

# Rota para Deletar um Cliente (DELETE /cliente/?id_cliente=123)
@bp_cliente.route('/', methods=['DELETE'])
def delete_cliente():
    id_cliente = request.args.get('id_cliente')
    if not id_cliente:
        return jsonify({"error": "O parâmetro 'id_cliente' é obrigatório"}), 400
    response_data, status_code = Funcoes.make_api_request('delete', f"{API_ENDPOINT_CLIENTE}{id_cliente}")
    return jsonify(response_data), status_code

# Rota para Validar se CPF já existe (GET /cliente/cpf?cpf=12345678900)
@bp_cliente.route('/cpf', methods=['GET'])
def validate_cliente_cpf():
    cpf = request.args.get('cpf')
    if not cpf:
        return jsonify({"error": "O parâmetro 'cpf' é obrigatório"}), 400
    response_data, status_code = Funcoes.make_api_request('get', f"{API_ENDPOINT_CLIENTE}cpf/{cpf}")
    return jsonify(response_data), status_code
