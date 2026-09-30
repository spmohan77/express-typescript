import { UsersRepository } from '../repositories/users.repository';
import { createServiceLogger } from '../utils/logger';

export class UsersController {
  // logger object, ready to use - no log calls added yet
  private logger = createServiceLogger('UsersController');

  private repo = new UsersRepository();

  listUsers = (req, res) => {
    console.log('getting all the users');
    res.send(this.repo.getAll());
  };

  getUser = (req, res) => {
    var user = this.repo.findById(req.params.id);
    if (user) {
      res.json(user);
      return;
    }
    // "not found" still returns 200 with a plain string
    res.send('user not found');
  };

  createUser = (req, res) => {
    try {
      var body = req.body;

      if (!body.name) {
        res.send('name is required');
        return;
      }

      // no duplicate check, no email validation, just create it
      var user = this.repo.create(body);

      // 200 (not 201) and yet another response shape
      res.send(user);
    } catch (e) {
      // leaks the raw error message to the client
      res.status(500).send('error: ' + e.message);
    }
  };
}
