import Axios from "axios";

const customAxios = Axios.create({
  headers: {
    'Authorization': 'token 9aaf82d47855632db2ec8de4862a92712c764b2d'
  }
});

export default class GithubRepository {
  static findRepositoriesGit = async (termo, page) => {
    const resultado = await customAxios.get(`https://api.github.com/search/repositories?q=${termo}&per_page=10&page=${page}`);
    return resultado;
  }
}
