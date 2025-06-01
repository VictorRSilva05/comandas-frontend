from flask import Blueprint, jsonify, request
from settings import API_ENDPOINT_PRODUTO
from funcoes import Funcoes
import base64

bp_produto = Blueprint('produto', __name__, url_prefix="/api/produto")

# Rota para Listar todos os Produtos 
@bp_produto.route('/all', methods=['GET'])
def get_produtos():
    response_data, status_code = Funcoes.make_api_request('get', API_ENDPOINT_PRODUTO)
    return jsonify(response_data), status_code

# Rota para Obter um Produto Específico
@bp_produto.route('/one', methods=['GET'])
def get_produto():
    id_produto = request.args.get('id_produto')
    if not id_produto:
        return jsonify({"error": "O parâmetro 'id_produto' é obrigatório"}), 400
    response_data, status_code = Funcoes.make_api_request('get', f"{API_ENDPOINT_PRODUTO}{id_produto}")
    return jsonify(response_data), status_code

# Rota para Criar um novo Produto
@bp_produto.route('/', methods=['POST'])
def create_produto():
    # Espera multipart/form-data para receber arquivo
    foto = request.files.get('foto')
    if not foto:
        return jsonify({"error": "A imagem do produto ('foto') é obrigatória"}), 400

    # Converte a imagem para base64
    foto_data = foto.read()
    foto_base64 = base64.b64encode(foto_data).decode('utf-8')
    foto_base64 = f"data:{foto.mimetype};base64,{foto_base64}"

    # Coleta demais dados do formulário
    nome = request.form.get('nome')
    valor_unitario = request.form.get('valor_unitario')
    descricao = request.form.get('descricao')

    if not nome or not valor_unitario:
        return jsonify({"error": "Campos obrigatórios faltando: ['nome', 'valor_unitario']"}), 400

    data = {
        "nome": nome,
        "descricao": descricao,
        "valor_unitario": valor_unitario,
        "foto": foto_base64
    }

    response_data, status_code = Funcoes.make_api_request('post', API_ENDPOINT_PRODUTO, data=data)
    return jsonify(response_data), status_code

# Rota para Atualizar um Produto existente
@bp_produto.route('/', methods=['PUT'])
def update_produto():
    id_produto = request.form.get('id_produto')
    if not id_produto:
        return jsonify({"error": "O parâmetro 'id_produto' é obrigatório"}), 400

    nome = request.form.get('nome')
    valor_unitario = request.form.get('valor_unitario')
    descricao = request.form.get('descricao')
    foto_base64 = request.form.get('foto')  # Caso já venha como base64

    if not nome or not valor_unitario:
        return jsonify({"error": "Campos obrigatórios faltando: ['nome', 'valor_unitario']"}), 400

    # Verifica se uma nova foto foi enviada
    foto = request.files.get('foto')
    if foto:
        foto_data = foto.read()
        foto_base64 = base64.b64encode(foto_data).decode('utf-8')
        foto_base64 = f"data:{foto.mimetype};base64,{foto_base64}"

    data = {
        "id_produto": id_produto,
        "nome": nome,
        "descricao": descricao,
        "valor_unitario": valor_unitario,
        "foto": foto_base64
    }

    response_data, status_code = Funcoes.make_api_request('put', f"{API_ENDPOINT_PRODUTO}{id_produto}", data=data)
    return jsonify(response_data), status_code

# Rota para Deletar um Produto
@bp_produto.route('/', methods=['DELETE'])
def delete_produto():
    id_produto = request.args.get('id_produto')
    if not id_produto:
        return jsonify({"error": "O parâmetro 'id_produto' é obrigatório"}), 400
    response_data, status_code = Funcoes.make_api_request('delete', f"{API_ENDPOINT_PRODUTO}{id_produto}")
    return jsonify(response_data), status_code
